require('dotenv').config();
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');
const DataLoader = require('dataloader');
const { ApolloError } = require('apollo-server-express');

const Locale = require('./locale');
const Database = require('./database');

class Model {

  // regular backend maintenance
  static async startMaintenance() {

    // TODO: uncomment when deploying
    // console.log("Starting scheduled maintenance");

    var db = new Database({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 1,
      multipleStatements: true
    });

    // list all approved businesses /////////////////////////////////////////////
    await db.query(
      `
      SET SQL_SAFE_UPDATES = 0;

      UPDATE
        business
      SET
        approved = 'APPROVED_AND_LISTED'
      WHERE
        approved = 'APPROVED'
      ;

      SET SQL_SAFE_UPDATES = 1;
      `
    );

    // list all approved events /////////////////////////////////////////////////
    await db.query(
      `
      SET SQL_SAFE_UPDATES = 0;

      UPDATE
        event
      SET
        approved = 'APPROVED_AND_LISTED'
      WHERE
        approved = 'APPROVED'
      ;

      SET SQL_SAFE_UPDATES = 1;
      `
    );

    // calculate business ratings ///////////////////////////////////////////////
    await db.query(
      `
      SET SQL_SAFE_UPDATES = 0;

      UPDATE
        business
      SET
        calculated_rating = (
          SELECT
            AVG(stars)
          FROM
            rating
          WHERE
            rating.business_id = business.id
        )
      WHERE
        approved = 'APPROVED_AND_LISTED'
      ;

      SET SQL_SAFE_UPDATES = 1;
      `
    );

    this.businessLoader.clearAll();
    this.eventLoader.clearAll();

    // update the listing index of businesses ///////////////////////////////////
    await db.query(
      `
      SET SQL_SAFE_UPDATES = 0;

      SET @curRow := 0;

      UPDATE
        business
      SET
        listing_index = (@curRow := @curRow + 1)
      WHERE
        approved = 'APPROVED_AND_LISTED'
      ORDER BY calculated_rating DESC
      ;

      SET SQL_SAFE_UPDATES = 1;
      `
    );
    this.orderedBusinessLoader.forEach(l => l.clearAll());

    // update the listing index of events ///////////////////////////////////////
    await db.query(
      `
      SET SQL_SAFE_UPDATES = 0;

      SET @curRow := 0;

      UPDATE
        event
      SET
        listing_index = (@curRow := @curRow + 1)
      WHERE
        end > CURRENT_TIMESTAMP
        AND approved = 'APPROVED_AND_LISTED'
      ORDER BY start
      ;

      UPDATE
        event
      SET
        listing_index = -1
      WHERE
        listing_index >= 0
        AND end <= CURRENT_TIMESTAMP
      ;

      SET SQL_SAFE_UPDATES = 1;
      `
    );

    this.orderedEventLoader.clearAll();

    db.close();
  }

  // Businesses/Events ////////////////////////////////////////////////////////

  static _generateAttachmentName() {
    return cryptoRandomString({length: 55, type: 'url-safe'});
  }

  static _writeAttachmentToFile(file) {
    return new Promise(async (resolve, reject) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      var uniqueName = this._generateAttachmentName() + path.extname(filename);
      var ws = fs.createWriteStream(path.join(process.env.ATTACHMENTS_DIR, uniqueName));
      var rs = createReadStream();
      rs.on('end', () => resolve(uniqueName));
      rs.on('error', () => reject());
      rs.pipe(ws);
    });
  }

  static async _storeAttachments(data) {
    if (data.display_picture) {
      data.display_picture = await this._writeAttachmentToFile(data.display_picture);
    }

    if (data.picture) {
      data.picture = await this._writeAttachmentToFile(data.picture);
    }

    if (data.government_id) {
      data.government_id = await this._writeAttachmentToFile(data.government_id);
    }

    if (data.trade_license) {
      data.trade_license = await this._writeAttachmentToFile(data.trade_license);
    }

    if (data.personnel) {
      for (var i = 0; i < data.personnel.length; ++i) {
        if (data.personnel[i].picture) {
          data.personnel[i].picture =
            await this._writeAttachmentToFile(data.personnel[i].picture);
        }

        if (data.personnel[i].attachments) {
          for (var j = 0; j < data.personnel[i].attachments.length; ++j) {
            data.personnel[i].attachments[j] =
              await this._writeAttachmentToFile(data.personnel[i].attachments[j]);
          }
        }
      }
    }

    if (data.attachments) {
      for (var i = 0; i < data.attachments.length; ++i) {
        data.attachments[i] = await this._writeAttachmentToFile(data.attachments[i]);
      }
    }

    if (data.menu) {
      for (var i = 0; i < data.menu.length; ++i) {
        data.menu[i] = await this._writeAttachmentToFile(data.menu[i]);
      }
    }

    return data;
  }

  static _removeAttachment(attachment) {
    fs.unlink(path.join(process.env.ATTACHMENTS_DIR, attachment), () => {});
  }

  static _updateAttachments(original, kept, added) {
    original.forEach(_ => {
      if (kept.indexOf(_) == -1) this._removeAttachment(_);
    });

    added.forEach(_ => kept.push(_));

    return kept;
  }

  static async addBusiness(data, owner) {
    try {
      var props = await this._storeAttachments(data);

      var display_name = data.display_name; delete props.display_name;
      var display_picture = data.display_picture; delete props.display_picture;
      if (data.sub_type && ! data.sub_type_string) {
        data.sub_type_string = Locale.strings.sub_type_string[data.type][data.sub_type];
      }
      var type = data.type; delete props.type;
      var sub_type = data.sub_type; delete props.sub_type;

      const result = await this.db.query(
        `
          INSERT INTO business
            (display_name, display_picture, type, sub_type, props, owner)
          VALUES
            (?, ?, ?, ?, ?, ?)
        `,
        [
          display_name,
          display_picture,
          type,
          sub_type,
          JSON.stringify(props),
          owner
        ]
      );

      this.businessUserLoader.clear(owner);

      return result.insertId;
    }
    catch(e) {
      console.error(e);
      throw new ApolloError("Failed to add business.", 'ADD_BUSINESS_FAILED');
    }
  }

  static async updateBusiness(id, data) {
    try {
      var stringifiedData = JSON.stringify(await this._storeAttachments(data));
      await this.db.query(
        `
          INSERT INTO business_tentative_update
            (business_id, updated_data)
          VALUES
            (?, ?)
          ON DUPLICATE KEY UPDATE
            updated_data = JSON_MERGE_PATCH(updated_data, ?),
            approved = 'TENTATIVE'
        `,
        [
          id,
          stringifiedData,
          stringifiedData
        ]
      );

      this.businessLoader.clear(id);
    }
    catch(e) {
      console.error(e);
      throw new ApolloError("Failed to update business.", 'UPDATE_BUSINESS_FAILED');
    }
  }

  static async updateDomesticHelpPersonnel(id, data) {
    var business = await this.businessLoader.load(id);

    var updated = false;

    var personnel = business["personnel"];
    if (! personnel) personnel = [];

    // remove personnel not found in 'old_personnel' and not in 'personnel'
    if (data["old_personnel"]) {
      for (var i = 0; i < personnel.length; ++i) {
        if (
          data["old_personnel"].indexOf(personnel[i]["name"]) == -1
          && (
            data["personnel"] === undefined ||
            data["personnel"].findIndex(_ => _["name"] == personnel[i]["name"]) == -1
          )
        ) {
          personnel.splice(i, 1); --i;
          updated = true;
        }
      }

      // no longer needed
      delete data["old_personnel"];
    }

    // update or add
    if (data["personnel"]) {
      for (var i = 0; i < data["personnel"].length; ++i) {
        var p = data["personnel"][i];

        p = await this._storeAttachments(p);

        const index = personnel.findIndex(_ => _["name"] == p["name"]);
        if (index == -1) {    // add
          personnel.push(p);
        }
        else {                // update
          if (p.attachments || p.old_attachments) {
            if (personnel[index].attachments) {
              p.attachments = this._updateAttachments(
                personnel[index].attachments,
                p.old_attachments || [],
                p.attachments || []
              );
            }

            if (p.old_attachments) delete p.old_attachments;
          }

          personnel[index] = { ...personnel[index], ...p };
        }

        updated = true;
      }

      delete data["personnel"];
    }

    if (updated) {
      await this.db.query(
        `
        UPDATE
          business
        SET
          props = JSON_MERGE_PATCH(props, ?)
        WHERE
          id = ?
        `,
        [ JSON.stringify({ personnel: personnel }), id ]
      );

      this.businessLoader.clear(id);
    }

    return data;
  }

  static async addEvent(data, owner) {
    try {
      var props = await this._storeAttachments(data);

      var display_name = data.display_name; delete props.display_name;
      var display_picture = data.display_picture; delete props.display_picture;
      var type = data.type; delete props.type;
      var start = data.duration.start;
      var end = data.duration.end;

      const result = await this.db.query(
        `
          INSERT INTO event
            (
              owner,
              display_name,
              display_picture,
              type,
              start,
              end,
              props
            )
          VALUES
            (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          owner,
          display_name,
          display_picture,
          type,
          start,
          end,
          JSON.stringify(props),
        ]
      );

      this.businessUserLoader.clear(owner);

      return result.insertId;
    }
    catch(e) {
      console.error(e);
      throw new ApolloError("Failed to add event.", 'ADD_EVENT_FAILED');
    }
  }

  static async updateEvent(id, data) {
    try {
      data = await this._storeAttachments(data);

      if (data.attachments || data.old_attachments) {
        var oldEvent = await this.eventLoader.load(id);

        if (oldEvent.attachments) {
          data.attachments = this._updateAttachments(
            oldEvent.attachments,
            data.old_attachments || [],
            data.attachments || []
          );
        }

        if (data.old_attachments) delete data.old_attachments;
      }

      var fields = [];
      var args = []

      if (data.display_name) {
        fields.push("display_name = ?");
        args.push(data.display_name);
        delete data.display_name;
      }

      if (data.display_picture) {
        fields.push("display_picture = ?");
        args.push(data.display_picture);
        delete data.display_picture;
      }

      if (data.type) {
        fields.push("type = ?");
        args.push(data.type);
        delete data.type;
      }

      if (data.duration) {
        fields.push("start = ?");
        args.push(data.duration.start);
        fields.push("end = ?");
        args.push(data.duration.end);
      }

      if (Object.keys(data).length > 0) {
        fields.push("props = JSON_MERGE_PATCH(props, ?)");
        args.push(JSON.stringify(data));
      }

      args.push(id);

      await this.db.query("UPDATE event SET " + fields.join(', ') + " WHERE id = ?;", args);

      this.eventLoader.clear(id);
    }
    catch(e) {
      console.error(e);
      throw new ApolloError("Failed to update event.", 'UPDATE_EVENT_FAILED');
    }
  }

  static async getBusinessesOwnedBy(userId) {
    var businessUser = await this.businessUserLoader.load(userId);

    if (! businessUser.owned_businesses) {
      const rows = await this.db.query(
        `
        SELECT
          id
        FROM
          business
        WHERE
          owner = ?
        `,
        [ userId ]
      );

      businessUser.owned_businesses = rows.map (_ => _.id);

      this.businessUserLoader
        .clear(userId)
        .prime(userId, businessUser);
    }

    var res = new Array(businessUser.owned_businesses.length);
    for (var i = 0; i < businessUser.owned_businesses.length; ++i) {
      res[i] = await this.businessLoader.load(businessUser.owned_businesses[i]);
    }

    return res;
  }

  static async getEventsOwnedBy(userId) {
    var businessUser = await this.businessUserLoader.load(userId);

    if (! businessUser.owned_events) {
      const rows = await this.db.query(
        `
        SELECT
          id
        FROM
          event
        WHERE
          owner = ?
        `,
        [ userId ]
      );

      businessUser.owned_events = rows.map (_ => _.id);

      this.businessUserLoader
        .clear(userId)
        .prime(userId, businessUser);
    }

    var res = new Array(businessUser.owned_events.length);
    for (var i = 0; i < businessUser.owned_events.length; ++i) {
      res[i] = await this.eventLoader.load(businessUser.owned_events[i]);
    }

    return res;
  }

  static async getBusinessUpdate(id) {

    var business = await this.businessLoader.load(id);

    if (business.update === undefined) {
      const rows = await this.db.query(
        `
        SELECT
          JSON_INSERT(
            updated_data,
            '$.approved', approved
          ) AS data
        FROM
          business_tentative_update
        WHERE
          business_id = ?
        `,
        [ id ]
      );

      if (rows.length == 1) {
        business.update = { ...business, ...JSON.parse(rows[0].data) };
      }
      else {
        business.update = null;
      }

      this.businessLoader
        .clear(id)
        .prime(id, business);
    }

    return business.update;
  }

  // Business/Event approval //////////////////////////////////////////////////

  static async setBusinessApproveStatus(id, approve) {
    try {
      await this.db.query(
        `
        UPDATE
          business
        SET
          approved = ?
        WHERE
          id = ?
        `,
        [ approve ? 'APPROVED' : 'REJECTED', id ]
      );

      this.businessLoader.clear(id);
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to approve business.",
        "BUSINESS_APPROVE_FAILED"
      );
    }
  }

  static async setBusinessUpdateApproveStatusIfExists(id, approve) {
    try {
      const result = await this.db.query(
        `
        UPDATE
          business_tentative_update
        SET
          approved = ?
        WHERE
          business_id = ?
        `,
        [ approve ? 'APPROVED' : 'REJECTED', id ]
      );

      if (result.affectedRows != 1) return false;

      if (approve) {
        var data = await this.db.query(
          `
          SELECT
            updated_data
          FROM
            business_tentative_update
          WHERE
            business_id = ?
          `,
          [ id ]
        );
        data = JSON.parse(data[0].updated_data);
        if (data) {
          if (data.attachments || data.old_attachments) {
            var oldBusiness = await this.businessLoader.load(id);

            if (oldBusiness.attachments) {
              data.attachments = _updateAttachments(
                oldBusiness.attachments,
                data.old_attachments || [],
                data.attachments || []
              );
            }

            if (data.old_attachments) delete data.old_attachments;
          }

          await this.db.query(
            `
            UPDATE
              business_tentative_update
            SET
              updated_data = ?
            WHERE
              business_id = ?
            `,
            [ JSON.stringify(data), id ]
          );
        }

        await this.db.query(
          `
          UPDATE
            business
          SET
            display_name = IFNULL((
              SELECT JSON_UNQUOTE(JSON_EXTRACT(updated_data, '$.display_name'))
              FROM business_tentative_update WHERE business_id = id
            ), display_name),
            display_picture = IFNULL((
              SELECT JSON_UNQUOTE(JSON_EXTRACT(updated_data, '$.display_picture'))
              FROM business_tentative_update WHERE business_id = id
            ), display_picture),
            props = JSON_MERGE_PATCH(props, (
              SELECT JSON_REMOVE(updated_data, '$.display_name', '$.display_picture')
              FROM business_tentative_update WHERE business_id = id
            ))
          WHERE
            id = ?
          `,
          [ id ]
        );

        await this.db.query(
          `
          DELETE FROM
            business_tentative_update
          WHERE
            business_id = ?
          `,
          [ id ]
        );
      }

      this.businessLoader.clear(id);
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to approve business update.",
        "BUSINESS_UPDATE_APPROVE_FAILED"
      );
    }

    return true;
  }

  static async setEventApproveStatus(id, approve) {
    try {
      await this.db.query(
        `
        UPDATE
          event
        SET
          approved = ?
        WHERE
          id = ?
        `,
        [ approve ? 'APPROVED' : 'REJECTED', id ]
      );

      this.eventLoader.clear(id);
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to approve event.",
        "EVENT_APPROVE_FAILED"
      );
    }
  }

  static async getTentativeBusinesses() {
    try {
      const rows = await this.db.query(
        `
        SELECT
          JSON_INSERT(
            props,
            '$.id', id,
            '$.owner', owner,
            '$.approved', approved,
            '$.rating', calculated_rating,
            '$.display_name', display_name,
            '$.display_picture', display_picture,
            '$.type', \`type\`,
            '$.sub_type', sub_type
          ) AS data
        FROM
          business
        WHERE
          approved = 'TENTATIVE' OR
          approved = 'REJECTED'
        `
      );

      return rows.map(row => JSON.parse(row.data));
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to retrieve tentative businesses",
        'RETRIEVE_TENTATIVE_BUSINESS_DB_FAILURE'
      );
    }
  }

  static async getTentativeUpdatedBusinesses() {
    try {
      const rows = await this.db.query(
        `
        SELECT
          business_id
        FROM
          business_tentative_update
        WHERE
          approved = 'TENTATIVE' OR
          approved = 'REJECTED'
        `
      );

      return rows.map(row => this.businessLoader.load(row.business_id));
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to retrieve tentative business updates",
        'RETRIEVE_TENTATIVE_BUSINESS_UPDATE_DB_FAILURE'
      );
    }
  }

  static async getTentativeEvents() {
    try {
      const rows = await this.db.query(
        `
        SELECT
          JSON_INSERT(
            props,
            '$.id', id,
            '$.owner', owner,
            '$.approved', approved,
            '$.display_name', display_name,
            '$.display_picture', display_picture,
            '$.type', \`type\`
          ) AS data
        FROM
          event
        WHERE
          approved = 'TENTATIVE' OR
          approved = 'REJECTED'
        `
      );

      return rows.map(row => JSON.parse(row.data));
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to retrieve tentative events",
        'RETRIEVE_TENTATIVE_EVENTS_DB_FAILURE'
      );
    }
  }

  // Rating ///////////////////////////////////////////////////////............

  static async setBusinessRating(userId, businessId, stars) {
    try {
      await this.db.query(
        `
        INSERT INTO
          rating (business_id, public_user_id, stars)
        VALUES
          (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          stars = ?
        `,
        [businessId, userId, stars, stars]
      );
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to rate business",
        'FAILED_TO_INSERT_RATING'
      );
    }
  }

  static async getBusinessRating(userId, businessId) {
    const rows = await this.db.query(
      `
      SELECT
        stars
      FROM
        rating
      WHERE
        business_id = ?
        AND public_user_id = ?
      `,
      [businessId, userId]
    );

    if (rows.length == 1) {
      return rows[0].stars;
    }
  }

  // Messaging ////////////////////////////////////////////////////////////////

  static async createMessageThread(targetId, senderId) {
    try {
      var business = await this.businessLoader.load(targetId);

      const result = await this.db.query(
        `
        INSERT INTO
          message_thread(business_id, public_user_id, business_user_id)
        VALUES
          (?, ?, ?)
        `,
        [ business.id, senderId, business.owner ]
      );

      return result.insertId;
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to create new message thread",
        'FAILED_TO_CREATE_THREAD'
      );
    }
  }

  static async addMessageToThread(threadId, msg, userType) {
    try {
      var messages = await this.msgLoader.load(threadId);

      var m = {
        index: messages.length > 0 ? messages[messages.length - 1].index + 1 : 0,
        msg: msg,
        time: new Date(),
        sender: userType
      };

      messages.push(m);
      this.msgLoader
        .clear(threadId)
        .prime(threadId, messages);

      this.db.query(
        `
        INSERT INTO
          message(message_thread_id, create_time, sender, data)
        VALUES
          (?, ?, ?, ?)
        `,
        [ threadId, m.time, m.sender, m.msg ]
      );

      return m.index;
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to send message",
        'FAILED_TO_ADD_THREAD_MESSAGE'
      );
    }
  }

  static async getMessageThreadIDsOwnedByBusinessUser(userId) {
    try {
      const rows = await this.db.query(
        `
        SELECT
          id
        FROM
          message_thread
        WHERE
          business_user_id = ?
        `,
        [ userId ]
      );

      return rows.map(_ => _.id);
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to retrieve message threads",
        'FAILED_TO_RETRIEVE_BUSINESS_USER_THREADS'
      );
    }
  }

  static async getMessageThreadIDsOwnedByPublicUser(userId) {
    try {
      const rows = await this.db.query(
        `
        SELECT
          id
        FROM
          message_thread
        WHERE
          public_user_id = ?
        `,
        [ userId ]
      );

      return rows.map(_ => _.id);
    }
    catch (e) {
      console.error(e);
      throw new ApolloError(
        "Failed to retrieve message threads",
        'FAILED_TO_RETRIEVE_PUBLIC_USER_THREADS'
      );
    }
  }

  static setThreadSeeIndexForTarget(thread, index) {
    this.db.query(
      `
      UPDATE
        message_thread
      SET
        targetLastSeenIndex = ?
      WHERE
        id = ?
      `,
      [ index, thread.id ]
    );

    thread.targetLastSeenIndex = index;

    this.msgThreadLoader
      .clear(thread.id)
      .prime(thread.id, thread);

    return thread;
  }

  static setThreadSeeIndexForSender(thread, index) {
    this.db.query(
      `
      UPDATE
        message_thread
      SET
        senderLastSeenIndex = ?
      WHERE
        id = ?
      `,
      [ index, thread.id ]
    );

    thread.senderLastSeenIndex = index;

    this.msgThreadLoader
      .clear(thread.id)
      .prime(thread.id, thread);

    return thread;
  }

  // Account management ///////////////////////////////////////////////////////

  static async publicUserSignup() {
    // try for a maximum of 5 rounds
    for (var trials = 0; trials < 5; ++trials) {
      var id = cryptoRandomString({length: 16});

      try {
        await this.db.query(
          `
          INSERT INTO
            public_user (id)
          VALUES
            (?)
          `,
          [ id ]
        );

        return id;
      }
      catch(e) {
        if (e.code != 'ER_DUP_ENTRY') {
          console.error(e);
          break;
        }
      }
    }

    throw new ApolloError(
      "Failed to signup.",
      'PUBLIC_USER_SIGNUP_FAILED'
    );
  }

  static async publicUserLogin(id) {
    var valid = false;
    try {
      const result = await this.db.query(
        `
        UPDATE
          public_user
        SET
          last_login=CURRENT_TIMESTAMP
        WHERE
          id=?
        `,
        [ id ]
      );

      valid = result.affectedRows == 1;
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to login.",
        'PUBLIC_USER_LOGIN_FAILED'
      );
    }

    if (valid) {
      // clear cached data
      this.publicUserLoader.clear(id);
    }

    return valid;
  }

  static async businessUserSignup(email, password) {
    const token = cryptoRandomString({length: 128, type: 'url-safe'});

    try {
      await this.db.query(
        `
        INSERT INTO
          business_user (email, password, token)
        VALUES
          (?, ?, ?)
        `,
        [ email, await bcrypt.hash(password, 10), token ]
      );

      return token;
    }
    catch(e) {
      if (e.code == 'ER_DUP_ENTRY') {
        throw new ApolloError(
          "User already signed up. Please try logging in or resetting your password.",
          'BUSINESS_USER_ALREADY_EXISTS'
        );
      }
      else {
        console.error(e);
        throw new ApolloError(
          "Failed to signup.",
          'BUSINESS_USER_SIGNUP_FAILED'
        );
      }
    }
  }

  static async businessUserVerify(email, token) {
    var result;
    try {
      result = await this.db.query(
        `
        SELECT
          id,
          verified,
          token
        FROM
          business_user
        WHERE
          email=?
        `,
        [ email ]
      );
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to verify user.",
        'BUSINESS_USER_VERIFY_FAILED'
      );
    }

    if (result.length != 1 || result[0].verified != 0 || result[0].token != token) {
      throw new ApolloError(
        "Invalid email or token.",
        'BUSINESS_USER_VERIFY_REJECTED'
      );
    }

    const id = result[0].id;

    try {
      await this.db.query(
        `
        UPDATE
          business_user
        SET
          last_login=CURRENT_TIMESTAMP,
          token=NULL,
          verified=1
        WHERE id=?
        `,
        [ id ]
      );
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to verify user.",
        'BUSINESS_USER_VERIFY_FAILED'
      );
    }

    // delete cached information
    this.businessUserLoader.clear(id);

    return id;
  }

  static async businessUserLogin(email, password) {
    var result;
      try {
        result = await this.db.query(
          `
          SELECT
            id,
            verified,
            password
          FROM
            business_user
          WHERE
            email=?
          `,
          [ email ]
        );
      }
      catch(e) {
        console.error(e);
        throw new ApolloError(
          "Failed to login.",
          'BUSINESS_USER_LOGIN_FAILED'
        );
      }

      if (result.length != 1 || ! (await bcrypt.compare(password, result[0].password))) {
        throw new ApolloError(
          "Invalid email or password.",
          'BUSINESS_USER_LOGIN_REJECTED'
        );
      }

      if (result[0].verified == 0) {
        throw new ApolloError(
          "Your account is not activated yet. Please check your email inbox.",
          'UNVERIFIED_BUSINESS_USER_LOGIN'
        );
      }

      const id = result[0].id;

      try {
        this.db.query(
          `
          UPDATE
            business_user
          SET
            last_login=CURRENT_TIMESTAMP
          WHERE
            id=?
          `,
          [ id ]
        );
      }
      catch(e) {
        console.error(e);
      }

      // delete cached information
      this.businessUserLoader.clear(id);

      return id;
  }

  static async businessUserChangePassword(userId, oldPassword, newPassword) {

    var result;
    try {
      result = await this.db.query(
        `
        SELECT
          password
        FROM
          business_user
        WHERE
          id=?
        `,
        [ userId ]
      );
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to verify password.",
        'BUSINESS_USER_PASSWORD_RETRIEVE_FAILURE'
      );
    }

    if (result.length == 1 && await bcrypt.compare(oldPassword, result[0].password)) {
      try {
        await this.db.query(
          `
          UPDATE
            business_user
          SET
            password=?
          WHERE
            id=?
          `,
          [ await bcrypt.hash(newPassword, 10), userId ]
        );
      }
      catch(e) {
        console.error(e);
        throw new ApolloError(
          "Failed to change password",
          'FAILED_TO_UPDATE_BUSINESS_USER_PASSWORD'
        );
      }
    }
    else {
      throw new ApolloError(
        "Invalid password.",
        'BUSINESS_USER_PASSWORD_CHANGE_REJECTED'
      );
    }
  }

  static async businessUserRequestResetPassword(email) {
    var result;
    try {
      result = await this.db.query(
        `
        SELECT
          id,
          verified
        FROM
          business_user
        WHERE
          email=?
        `,
        [ email ]
      );
    }
    catch(e) {
      console.error(e);
      return;
    }

    if (result.length != 1 || result[0].verified == 0) {
      return;
    }

    const id = result[0].id;
    const token = cryptoRandomString({length: 128, type: 'url-safe'});

    try {
      await this.db.query(
        `
        UPDATE
          business_user
        SET
          token=?
        WHERE
          id=?
        `,
        [ token, id ]
      );
    }
    catch(e) {
      console.error(e);
      return;
    }

    // delete cached information
    this.businessUserLoader.clear(id);

    return token;
  }

  static async businessUserResetPassword(email, token, newPassword) {

    var result;
    try {
      result = await this.db.query(
        `
        SELECT
          id,
          verified,
          token
        FROM
          business_user
        WHERE
          email=?
        `,
        [ email ]
      );
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to verify token.",
        'BUSINESS_USER_TOKEN_RETRIEVE_FAILURE'
      );
    }

    if (result.length != 1 || result[0].token != token) {
      throw new ApolloError(
        "Invalid email or token.",
        'BUSINESS_USER_PASSWORD_RESET_REJECTED'
      );
    }

    if (result[0].verified == 0) {
      throw new ApolloError(
        "Your account is not activated yet. Please check your email inbox.",
        'UNVERIFIED_BUSINESS_USER_PASSWORD_RESET'
      );
    }

    const id = result[0].id;

    try {
      await this.db.query(
        `UPDATE
          business_user
        SET
          password=?,
          token=NULL
        WHERE
          id=?
        `,
        [ await bcrypt.hash(newPassword, 10), id ]
      );
    }
    catch(e) {
      console.error(e);
      throw new ApolloError(
        "Failed to reset password.",
        'BUSINESS_USER_PASSWORD_REST_FAILURE'
      );
    }

    // delete cached information
    this.businessUserLoader.clear(id);

    return id;
  }
}

Model.db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

Model.businessUserLoader = new DataLoader(
  async (ids) => {
    const rows = await Model.db.query(
      `
      SELECT
        *
      FROM
        business_user
      WHERE
        id IN (?)
      ORDER BY
        FIELD(id, ?)
      `,
      [ ids, ids ]
    );

    var res = new Array(ids.length);
    var i = 0;
    var j = 0;
    while (i < ids.length && j < rows.length) {
      res[i] = rows[j].id == ids[i]
        ? rows[j++]
        : null;
      ++i;
    }
    while (i < ids.length) res[i++] = null;

    return res;
  }
);

Model.publicUserLoader = new DataLoader(
  async (ids) => {
    const rows = await Model.db.query(
      `
      SELECT
        id,
        create_time,
        last_login,
        first_name,
        last_name
      FROM
        public_user
      WHERE
        id IN (?)
      ORDER BY
        FIELD(id, ?)
      `,
      [ ids, ids ]
    );

    var res = new Array(ids.length);
    var i = 0;
    var j = 0;
    while (i < ids.length && j < rows.length) {
      res[i] = rows[j].id == ids[i]
        ? rows[j++]
        : null;
      ++i;
    }
    while (i < ids.length) res[i++] = null;

    return res;
  }
);

Model.businessLoader = new DataLoader(
  async (ids) => {
    const rows = await Model.db.query(
      `
      SELECT
        id,
        JSON_INSERT(
          props,
          '$.id', id,
          '$.owner', owner,
          '$.approved', approved,
          '$.rating', calculated_rating,
          '$.display_name', display_name,
          '$.display_picture', display_picture,
          '$.type', \`type\`,
          '$.sub_type', sub_type
        ) AS data
      FROM
        business
      WHERE
        id IN (?)
      ORDER BY
        FIELD(id, ?)
      `,
      [ ids, ids ]
    );

    var res = new Array(ids.length);
    var i = 0;
    var j = 0;
    while (i < ids.length && j < rows.length) {
      res[i] = rows[j].id == ids[i]
        ? JSON.parse(rows[j++].data)
        : null;
      ++i;
    }
    while (i < ids.length) res[i++] = null;

    return res;
  }
);

Model.orderedBusinessLoader = new Map(
  [
    'SelfEmployedBusiness',
    'ChildEducationBusiness',
    'DomesticHelpBusiness',
    'BeautyBusiness',
    'TransportationBusiness',
    'HospitalityBusiness',
    'StationeryBusiness',
    'MadeInQatarBusiness',
    'SportsBusiness',
    'EntertainmentBusiness',
    'FoodBusiness',
    'CleaningAndMaintenanceBusiness'
  ].map(type =>
  [
    type,
    new DataLoader(
      async (keys) => {
        const rows = await Model.db.query(
          `
          SELECT
            id,
            sub_type,
            listing_index
          FROM
            business
          WHERE
            \`type\` = ?
            AND listing_index IN (?)
          ORDER BY
            FIELD(listing_index, ?)
          `,
          [ type, keys, keys ]
        );

        var res = new Array(keys.length);
        var i = 0;
        var j = 0;
        while (i < keys.length && j < rows.length) {
          res[i] = rows[j].listing_index == keys[i]
            ? rows[j++]
            : null;
          ++i;
        }
        while (i < keys.length) res[i++] = null;

        return res;
      }
    )
  ]
));

Model.eventLoader = new DataLoader(
  async (ids) => {
    const rows = await Model.db.query(
      `
      SELECT
        id,
        JSON_INSERT(
          props,
          '$.id', id,
          '$.owner', owner,
          '$.approved', approved,
          '$.display_name', display_name,
          '$.display_picture', display_picture,
          '$.type', \`type\`
        ) AS data
      FROM
        event
      WHERE
        id IN (?)
      ORDER BY
        FIELD(id, ?)
      `,
      [ ids, ids ]
    );

    var res = new Array(ids.length);
    var i = 0;
    var j = 0;
    while (i < ids.length && j < rows.length) {
      res[i] = rows[j].id == ids[i]
        ? JSON.parse(rows[j++].data)
        : null;
      ++i;
    }
    while (i < ids.length) res[i++] = null;

    return res;
  }
);

Model.orderedEventLoader = new DataLoader(
  async (keys) => {
    const rows = await Model.db.query(
      `
      SELECT
        id,
        type,
        listing_index
      FROM
        event
      WHERE
        listing_index IN (?)
      ORDER BY
        FIELD(listing_index, ?)
      `,
      [ keys, keys ]
    );

    var res = new Array(keys.length);
    var i = 0;
    var j = 0;
    while (i < keys.length && j < rows.length) {
      res[i] = rows[j].listing_index == keys[i]
        ? rows[j++]
        : null;
      ++i;
    }
    while (i < keys.length) res[i++] = null;

    return res;
  }
);

Model.msgThreadLoader = new DataLoader(
  async (ids) => {
    const rows = await Model.db.query(
      `
      SELECT
        id,
        business_id,
        public_user_id,
        business_user_id,
        targetLastSeenIndex,
        senderLastSeenIndex
      FROM
        message_thread
      WHERE
        id IN (?)
      ORDER BY
        FIELD(id, ?)
      `,
      [ ids, ids ]
    );

    var res = new Array(ids.length);
    var i = 0;
    var j = 0;
    while (i < ids.length && j < rows.length) {
      res[i] = rows[j].id == ids[i]
        ? rows[j++]
        : null;
      ++i;
    }
    while (i < ids.length) res[i++] = null;

    return res;
  }
);

Model.msgLoader = new DataLoader(
  async (ids) => {
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
        `
        SELECT
          data AS msg,
          sender,
          create_time
        FROM
          message
        WHERE
          message_thread_id = ?
        ORDER BY create_time
        `,
        [ ids[i] ]
      );

      var messages = new Array(rows.length);
      for (var j = 0; j < rows.length; ++j) {
        messages[j] = {
          index: j,
          msg: rows[j].msg,
          time: rows[j].create_time,
          sender: rows[j].sender
        }
      }
      res[i] = messages;
    }
    return res;
  }
);

module.exports = Model;
