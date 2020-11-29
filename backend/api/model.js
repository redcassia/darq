require('dotenv').config();
var fs = require('fs');
var path = require('path');
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

      const result = await Model.db.query(
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
      console.log(e);
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
            updated_data = JSON_MERGE_PRESERVE(updated_data, ?),
            approved = 'TENTATIVE'
        `,
        [
          id,
          stringifiedData,
          stringifiedData
        ]
      );
    }
    catch(e) {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
      throw new ApolloError("Failed to update event.", 'UPDATE_EVENT_FAILED');
    }
  }

  static targetSeeMessage(thread, index) {
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

  static senderSeeMessage(thread, index) {
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
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
        "SELECT * FROM business_user WHERE id = ?",
        [ ids[i] ]
      );

      res[i] = rows[0];
    }
    return res;
  }
);

Model.publicUserLoader = new DataLoader(
  async (ids) => {
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
        `
        SELECT
          CAST(id AS CHAR(18)) AS id,
          create_time,
          last_login,
          first_name,
          last_name
        FROM
          public_user
        WHERE
          id = ?
        `,
        [ ids[i] ]
      );

      res[i] = rows[0];
    }
    return res;
  }
);

Model.businessLoader = new DataLoader(
  async (ids) => {
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
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
          id = ?
        `,
        [ ids[i] ]
      );

      res[i] = rows[0] ? JSON.parse(rows[0].data) : null;
    }
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
        const offset = keys[0];
        const limit = keys[keys.length - 1] - offset + 1;

        const rows = await Model.db.query(
          `
          SELECT
            id
          FROM
            business
          WHERE
            \`type\` = ?
            AND listing_index >= 0
          ORDER BY listing_index
          LIMIT ?
          OFFSET ?
          `,
          [ type, limit, offset ]
        );

        return keys.map(key => {
          if (rows[key - offset]) return rows[key - offset].id;
          else return null;
        });
      }
    )
  ]
));

Model.eventLoader = new DataLoader(
  async (ids) => {
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
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
          id = ?
        `,
        [ ids[i] ]
      );
      res[i] = rows[0] ? JSON.parse(rows[0].data) : null;
    }
    return res;
  }
);

Model.orderedEventLoader = new DataLoader(
  async (keys) => {
    const offset = keys[0];
    const limit = keys[keys.length - 1] - offset + 1;

    const rows = await Model.db.query(
      `
      SELECT
        id
      FROM
        event
      WHERE
        listing_index >= 0
      ORDER BY listing_index
      LIMIT ?
      OFFSET ?
      `,
      [ limit, offset ]
    );

    return keys.map(key => {
      if (rows[key - offset]) return rows[key - offset].id;
      else return null;
    });
  }
);

Model.msgThreadLoader = new DataLoader(
  async (ids) => {
    var res = new Array(ids.length);
    for (var i = 0; i < ids.length; ++i) {
      const rows = await Model.db.query(
        `
        SELECT
          id,
          business_id,
          CAST(public_user_id AS CHAR(18)) AS public_user_id,
          business_user_id,
          targetLastSeenIndex,
          senderLastSeenIndex
        FROM
          message_thread
        WHERE
          id = ?
        `,
        [ ids[i] ]
      );

      res[i] = rows[0];
    }
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
