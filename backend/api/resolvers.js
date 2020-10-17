require('dotenv').config()
var mysql = require('mysql');
const DataLoader = require('dataloader')
const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string');
const jsonwebtoken = require('jsonwebtoken');
const { ApolloError, GraphQLUpload } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
var fs = require('fs');
var path = require('path')

const strings = require('./locale')
const Mailer = require('./mailer');
const Mail = require('nodemailer/lib/mailer');

class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool(this.config);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function(err, connection) {
        if (err) {
          connection.release();
          console.log("Error getting a MySQL connection from pool. ", err);
          reject(err);
        }

        connection.query(sql, args, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);

          connection.release();
        });
      });
    });
  }

  connection() {
    return this.pool.getConnection();
  }

  close() {
    this.pool.end();
  }
}

var db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

const businessUserLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
        "SELECT * FROM business_user WHERE id = ?",
        [id]
      );

      return rows[0];
    });
  }
);

const publicUserLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
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
        [ id ]
      );

      return rows[0];
    });
  }
);

const businessLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
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
        [id]
      );
      return rows[0] ? JSON.parse(rows[0].data) : null;
    });
  }
);

const orderedBusinessLoader = new Map(
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

        const rows = await db.query(
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

const eventLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
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
        [id]
      );
      return rows[0] ? JSON.parse(rows[0].data) : null;
    });
  }
);

const orderedEventLoader = new DataLoader(
  async (keys) => {
    const offset = keys[0];
    const limit = keys[keys.length - 1] - offset + 1;

    const rows = await db.query(
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

const msgThreadLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
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
        [ id ]
      );

      return rows[0];
    });
  }
);

const msgLoader = new DataLoader(
  async (ids) => {
    return ids.map(async (id) => {
      const rows = await db.query(
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
        [ id ]
      );

      var messages = new Array(rows.length);
      for (var i = 0; i < rows.length; ++i) {
        messages[i] = {
          index: i,
          msg: rows[i].msg,
          time: rows[i].create_time,
          sender: rows[i].sender
        }
      }
      return messages;
    });
  }
);

function _localize(data, locale) {

  if (data[locale] !== undefined) {
    return data[locale];
  }
  else {
    for (var key in data) {
      if (data[key] instanceof Object) {
        data[key] = _localize(data, locale);
      }
      else if (data[key] instanceof Array) {
        data[key] = data[key].map(_ => _localize(_, locale));
      }
    }
    return data;
  }
}

// regular backend maintenance
async function maintenance() {

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

  businessLoader.clearAll();
  eventLoader.clearAll();

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
  orderedBusinessLoader.forEach(l => l.clearAll());

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

  orderedEventLoader.clearAll();

  db.close();

  // schedule next maintenance ////////////////////////////////////////////////
  // TODO: change when deploying
  setTimeout(maintenance, 10000);
}

// run every 10 seconds, for development
// deployed server should run maintenance() at a certain time every day
// TODO: change when deploying
setTimeout(maintenance, 1000);

function _validateAuthenticatedBusinessUser(user) {
  if (! user || user.type != 'BUSINESS') {
    throw new ApolloError("No or invalid authentication", 'USER_NOT_AUTHENTICATED');
  }
}

function _validateAuthenticatedBusinessUserOrAdmin(user) {
  if (! user || (user.type != 'BUSINESS' && user.type != 'ADMIN')) {
    throw new ApolloError("No or invalid authentication", 'USER_NOT_AUTHENTICATED');
  }
}

function _validateAuthenticatedAdmin(user) {
  if (! user || user.type != 'ADMIN') {
    throw new ApolloError(
      "Congratulations! You have reached the super-secret part of the API, but you're not authenticated :(",
      'USER_NOT_AUTHENTICATED'
    );
  }
}

function _validateAuthenticatedPublicUser(user) {
  if (! user || user.type != 'PUBLIC') {
    throw new ApolloError("No or invalid authentication", 'USER_NOT_AUTHENTICATED');
  }
}

async function _validateBusinessOwner(user, businessId) {
  var business = await businessLoader.load(businessId);
  if (business.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this business! This incident will be reported.",
      'NOT_BUSINESS_OWNER'
    );
  }
}

async function _validateBusinessOwnerAndType(user, businessId, type) {
  var business = await businessLoader.load(businessId);
  if (business.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this business! This incident will be reported.",
      'NOT_BUSINESS_OWNER'
    );
  }
  if (business.type != type) {
    throw new ApolloError(
      "Invalid business type.",
      'INVALID_BUSINESS_TYPE'
    );
  }
}

async function _validateEventOwner(user, eventId) {
  var event = await eventLoader.load(eventId);
  if (event.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this event! This incident will be reported.",
      'NOT_EVENT_OWNER'
    );
  }
}

function _generateAttachmentName() {
  return cryptoRandomString({length: 55, type: 'url-safe'});
}

function _writeAttachmentToFile(file) {
  return new Promise(async (resolve, reject) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    var uniqueName = _generateAttachmentName() + path.extname(filename);
    var ws = fs.createWriteStream(path.join(process.env.ATTACHMENTS_DIR, uniqueName));
    var rs = createReadStream();
    rs.on('end', () => resolve(uniqueName));
    rs.on('error', () => reject());
    rs.pipe(ws);
  });
}

async function _storeAttachments(data) {
  if (data.display_picture) {
    data.display_picture = await _writeAttachmentToFile(data.display_picture);
  }

  if (data.government_id) {
    data.government_id = await _writeAttachmentToFile(data.government_id);
  }

  if (data.trade_license) {
    data.trade_license = await _writeAttachmentToFile(data.trade_license);
  }

  if (data.personnel) {
    for (var i = 0; i < data.personnel.length; ++i) {
      if (data.personnel[i].picture) {
        data.personnel[i].picture = 
          await _writeAttachmentToFile(data.personnel[i].picture);
      }

      if (data.personnel[i].attachments) {
        for (var j = 0; j < data.personnel[i].attachments.length; ++j) {
          data.personnel[i].attachments[j] =
            await _writeAttachmentToFile(data.personnel[i].attachments[j]);
        }
      }
    }
  }

  if (data.attachments) {
    for (var i = 0; i < data.attachments.length; ++i) {
      data.attachments[i] = await _writeAttachmentToFile(data.attachments[i]);
    }
  }

  if (data.menu) {
    for (var i = 0; i < data.menu.length; ++i) {
      data.menu[i] = await _writeAttachmentToFile(data.menu[i]);
    }
  }

  return data;
}

function _removeAttachment(attachment) {
  fs.unlink(path.join(process.env.ATTACHMENTS_DIR, attachment), () => {});
}

function _updateAttachments(original, kept, added) {
  original.forEach(_ => {
    if (kept.indexOf(_) == -1) _removeAttachment(_);
  });

  added.forEach(_ => kept.push(_));

  return kept;
}

async function _addBusiness(data, owner) {
  try {
    var props = await _storeAttachments(data);

    var display_name = data.display_name; delete props.display_name;
    var display_picture = data.display_picture; delete props.display_picture;
    if (data.sub_type && ! data.sub_type_string) {
      data.sub_type_string = strings.sub_type_string[data.type][data.sub_type];
    }
    var type = data.type; delete props.type;
    var sub_type = data.sub_type; delete props.sub_type;

    const result = await db.query(
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
    id = result.insertId;

    businessUserLoader.clear(owner);

    return id;
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to add business.", 'ADD_BUSINESS_FAILED');
  }
}

async function _updateBusiness(id, data) {
  try {
    var stringifiedData = JSON.stringify(await _storeAttachments(data));
    await db.query(
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

async function _processUpdatedPersonnel(id, data) {
  var business = await businessLoader.load(id);

  var updated = false;

  var personnel = business["personnel"];
  if (! personnel) personnel = [];

  // remove personnel not found in 'old_personnel' and not in 'personnel'
  if (data["old_personnel"]) {
    for (var i = 0; i < personnel.length; ++i) {
      if (
        data["old_personnel"].indexOf(personnel[i]["name"]) == -1
        && data["personnel"].findIndex(_ => _["name"] == personnel[i]["name"]) == -1
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

      const index = personnel.findIndex(_ => _["name"] == p["name"]);
      if (index == -1) {    // add
        personnel.push(p);
      }
      else {                // update
        p = await _storeAttachments(p);

        if (p.attachments || p.old_attachments) {
          if (personnel[index].attachments) {
            p.attachments = _updateAttachments(
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
    await db.query(
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

    businessLoader.clear(id);
  }

  return data;
}

async function _addEvent(data, owner) {
  try {
    var props = await _storeAttachments(data);

    var display_name = data.display_name; delete props.display_name;
    var display_picture = data.display_picture; delete props.display_picture;
    var type = data.type; delete props.type;
    var start = data.duration.start;
    var end = data.duration.end;

    const result = await db.query(
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
    id = result.insertId;

    businessUserLoader.clear(owner);

    return id;
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to add event.", 'ADD_EVENT_FAILED');
  }
}

async function _updateEvent(id, data) {
  try {
    data = await _storeAttachments(data);

    if (data.attachments || data.old_attachments) {
      var oldEvent = await eventLoader.load(id);

      if (oldEvent.attachments) {
        data.attachments = _updateAttachments(
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

    await db.query("UPDATE event SET " + fields.join(', ') + " WHERE id = ?;", args);

    eventLoader.clear(id);
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to update event.", 'UPDATE_EVENT_FAILED');
  }
}

function _targetSeeMessage(thread, index) {
  db.query(
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

  msgThreadLoader
    .clear(thread.id)
    .prime(thread.id, thread);

  return thread;
}

function _senderSeeMessage(thread, index) {
  db.query(
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

  msgThreadLoader
    .clear(thread.id)
    .prime(thread.id, thread);

  return thread;
}

const resolvers = {
  Query: {
    async user(_, args, { user }) {
      if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      if (user.type == 'BUSINESS') {
        var businessUser = await businessUserLoader.load(user.id);
        businessUser.type = user.type;
        return businessUser;
      }
      else if (user.type == 'PUBLIC') {
        var publicUser = await publicUserLoader.load(user.id);
        publicUser.type = user.type;
        return publicUser;
      }
      else {
        throw new ApolloError(
          "I'm sorry. I made a boom boom. :(",
          'INVALID_USER_TYPE'
        );
      }
    },

    async business(_, { id }, { user }) {
      _validateAuthenticatedPublicUser(user);

      return _localize(await businessLoader.load(id), user.locale);
    },

    async businesses(_, { limit, offset, type, sub_types }, { user }) {
      _validateAuthenticatedPublicUser(user);

      var res = [];

      if (sub_types) {
        var count = 0;
        var realOffset = 0;

        // find the real offset according to this filter
        while (count < offset) {
          var arr = await orderedBusinessLoader.get(type).loadMany(
            Array.from(Array(offset - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var b = await businessLoader.load(id);
              if (sub_types.includes(b.sub_type)) ++count;
              ++realOffset;
            }
            else {
              count = offset;
            }
          }
        }

        // collect the result
        count = 0;
        while (count < limit) {
          var arr = await orderedBusinessLoader.get(type).loadMany(
            Array.from(Array(limit - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var b = await businessLoader.load(id);
              if (sub_types.includes(b.sub_type)) {
                res.push(b);
                ++count;
              }
              ++realOffset;
            }
            else {
              count = limit;
            }
          }
        }
      }
      else {
        res = (await orderedBusinessLoader.get(type).loadMany(
          Array.from(Array(limit), (_, i) => i + offset)
        )).map(_ => _ ? businessLoader.load(_) : null);
      }

      return res
        .filter(_ => _ != null)
        .map(_ => _localize(_, user.locale));
    },

    async event(_, { id }, { user }) {
      _validateAuthenticatedPublicUser(user);

      return _localize(await eventLoader.load(id), user.locale);
    },

    async events(_, { limit, offset, type }, { user }) {
      _validateAuthenticatedPublicUser(user);

      var res = [];

      if (type) {
        var count = 0;
        var realOffset = 0;

        // find the real offset according to this filter
        while (count < offset) {
          var arr= await orderedEventLoader.loadMany(
            Array.from(Array(offset - count), (_, i) => i + realOffset)
          );
          
          for (var id of arr) {
            if (id) {
              var e = await eventLoader.load(id);
              if (e.type == type) ++count;
              ++realOffset;
            }
            else {
              count = offset;
            }
          }
        }

        // collect the result
        count = 0;
        while (count < limit) {
          var arr = await orderedEventLoader.loadMany(
            Array.from(Array(limit - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var e = await eventLoader.load(id);
              if (e.type == type) {
                res.push(e);
                ++count;
              }
              ++realOffset;
            }
            else {
              count = limit;
            }
          }
        }
      }
      else {
        res = (await orderedEventLoader.loadMany(
          Array.from(Array(limit), (_, i) => i + offset)
        )).map(_ => _ ? eventLoader.load(_) : null);
      }

      return res
        .filter(_ => _ != null)
        .map(_ => _localize(_, user.locale));
    },

    // admin queries

    async admin(_, args, { user }) {
      _validateAuthenticatedAdmin(user);

      return { _: "mkay" };
    }
  },

  Mutation: {
    async rateBusiness(_, { id, stars }, { user }) {
      _validateAuthenticatedPublicUser(user);

      await db.query(
        `
        INSERT INTO
          rating (business_id, public_user_id, stars)
        VALUES
          (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          stars = ?
        `,
        [id, user.id, stars, stars]
      );
    },

    async sendMessage(_, { msg, threadId, targetBusinessId }, { user }) {
      if (! threadId) {
        _validateAuthenticatedPublicUser(user);

        if (! targetBusinessId) {
          throw new ApolloError(
            "No target specified",
            "MESSAGE_TARGET_MISSING"
          );
        }

        var business = await businessLoader.load(targetBusinessId);

        const result = await db.query(
          `
          INSERT INTO
            message_thread(business_id, public_user_id, business_user_id)
          VALUES
            (?, ?, ?)
          `,
          [ business.id, user.id, business.owner ]
        );

        threadId = result.insertId;
      }
      else if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      var thread = await msgThreadLoader.load(threadId);

      if (user.type == 'BUSINESS') {
        if (thread.business_user_id != user.id) {
          throw new ApolloError(
            "You are not the owner of this thread",
            'CANNOT_SEND_BUSINESS_USER_NOT_THREAD_OWNER'
          );
        }
      }
      else if (user.type == 'PUBLIC') {
        if (thread.public_user_id != user.id) {
          throw new ApolloError(
            "You are not the owner of this thread",
            'CANNOT_SEND_PUBLIC_USER_NOT_THREAD_OWNER'
          );
        }
      }
      else {
        throw new ApolloError(
          "I'm sorry. I made a boom boom. :(",
          'INVALID_USER_TYPE'
        );
      }

      var messages = await msgLoader.load(thread.id);
      var m = {
        index: messages.length > 0 ? messages[messages.length - 1].index + 1 : 0,
        msg: msg,
        time: new Date(),
        sender: user.type
      };

      messages.push(m);
      msgLoader
        .clear(thread.id)
        .prime(thread.id, messages);

      db.query(
        `
        INSERT INTO
          message(message_thread_id, create_time, sender, data)
        VALUES
          (?, ?, ?, ?)
        `,
        [ thread.id, m.time, m.sender, m.msg ]
      );

      if (user.type == 'BUSINESS') return _targetSeeMessage(thread, m.index);
      else return _senderSeeMessage(thread, m.index);
    },

    async seeMessage(_, { threadId, index }, { user }) {
      if (! user) {
        throw new ApolloError(
          "Sorry... You're not authenticated! :c",
          'USER_NOT_AUTHENTICATED'
        );
      }

      var thread = await msgThreadLoader.load(threadId);

      if (user.type == 'BUSINESS') {

        if (thread.business_user_id != user.id) {
          throw new ApolloError(
            "You are not the owner of this thread",
            'CANNOT_SEE_BUSINESS_USER_NOT_THREAD_OWNER'
          );
        }

        if (thread.targetLastSeenIndex !== null && thread.targetLastSeenIndex >= index) {
          throw new ApolloError(
            "Invalid message see index",
            'INVALID_TARGET_SEE_INDEX'
          );
        }

        return _targetSeeMessage(thread, index);
      }
      else if (user.type == 'PUBLIC') {
        if (thread.public_user_id != user.id) {
          throw new ApolloError(
            "You are not the owner of this thread",
            'CANNOT_SEE_PUBLIC_USER_NOT_THREAD_OWNER'
          );
        }

        if (thread.senderLastSeenIndex !== null && thread.senderLastSeenIndex >= index) {
          throw new ApolloError(
            "Invalid message see index",
            'INVALID_SENDER_SEE_INDEX'
          );
        }

        return _senderSeeMessage(thread, index);
      }
      else {
        throw new ApolloError(
          "I'm sorry. I made a boom boom. :(",
          'INVALID_USER_TYPE'
        );
      }
    },

    async setLocale(_, { locale }, { user }) {
      if (! user) {
        throw new ApolloError(
          "Sorry... You're not authenticated! :c",
          'USER_NOT_AUTHENTICATED'
        );
      }

      user.locale = locale;

      return jsonwebtoken.sign(
        user,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async createPublicUser(_, { locale }) {
      var id = cryptoRandomString({length: 18, type: 'numeric'});
      while (id.charAt(0) == '0') cryptoRandomString({length: 18, type: 'numeric'})

      try {
        await db.query(
          "INSERT INTO public_user (id) VALUES (?)",
          [ id ]
        );
      }
      catch(e) {
        console.log(e);
        throw new ApolloError("Failed to signup.", 'PUBLIC_USER_SIGNUP_FAILED');
      }

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'PUBLIC', locale: locale || 'en' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async createBusinessUser(_, { email, password }) {
      var id;
      try {
        const result = await db.query(
          "INSERT INTO business_user (email, password) VALUES (?, ?)",
          [ email, await bcrypt.hash(password, 10) ]
        );
        id = result.insertId;

        // TODO: send activation link
        Mailer.newUser(email);
      }
      catch(e) {
        console.log(e);
        throw new ApolloError("Failed to signup.", 'BUSINESS_USER_SIGNUP_FAILED');
      }

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'BUSINESS' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async authenticatePublicUser(_, { id, locale }) {
      var valid = false;
      try {
        const result = await db.query(
          "UPDATE public_user SET last_login=CURRENT_TIMESTAMP WHERE id=?",
          [ id ]
        );

        valid = result.affectedRows == 1;
      }
      catch(e) {
        console.log(e);
        throw new ApolloError(
          "Failed to login.",
          'PUBLIC_USER_LOGIN_FAILED'
        );
      }

      if (valid) {
        // clear cached data
        publicUserLoader.clear(id);

        // return json web token
        return jsonwebtoken.sign(
          { id: id, type: 'PUBLIC', locale: locale || 'en' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
      }
      else {
        throw new ApolloError(
          "Invalid ID. Please make sure the user ID is correct or signup again to obtain a new ID",
          'PUBLIC_USER_LOGIN_REJECTED'
        );
      }
    },

    async authenticateBusinessUser(_, { email, password }) {
      var result;
      try {
        result = await db.query(
          "SELECT id, password FROM business_user WHERE email=?",
          [ email ]
        );
      }
      catch(e) {
        console.log(e);
        throw new ApolloError(
          "Failed to login.",
          'BUSINESS_USER_LOGIN_FAILED'
        );
      }

      if (result.length == 1 && await bcrypt.compare(password, result[0].password)) {
        const id = result[0].id;

        try {
          db.query(
            "UPDATE business_user SET last_login=CURRENT_TIMESTAMP WHERE id=?",
            [ id ]
          );
        }
        catch(e) {
          console.log(e);
        }

        // delete cached information
        businessUserLoader.clear(id);

        // return json web token
        return jsonwebtoken.sign(
          { id: id, type: 'BUSINESS' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
      }
      else {
        throw new ApolloError(
          "Invalid email or password.",
          'BUSINESS_USER_LOGIN_REJECTED'
        );
      }
    },

    async changeBusinessUserPassword(_, { oldPassword, newPassword }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var result;
      try {
        result = await db.query(
          "SELECT password FROM business_user WHERE id=?",
          [ user.id ]
        );
      }
      catch(e) {
        console.log(e);
        throw new ApolloError(
          "Failed to verify password.",
          'BUSINESS_USER_PASSWORD_RETRIEVE_FAILURE'
        );
      }

      if (result.length == 1 && await bcrypt.compare(oldPassword, result[0].password)) {
        const id = result[0].id;

        try {
          await db.query(
            "UPDATE business_user SET password=? WHERE id=?",
            [ await bcrypt.hash(newPassword, 10), user.id ]
          );
        }
        catch(e) {
          console.log(e);
        }
      }
      else {
        throw new ApolloError(
          "Invalid password.",
          'BUSINESS_USER_PASSWORD_CHANGE_REJECTED'
        );
      }
    },

    async addSelfEmployedBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SelfEmployedBusiness';

      _addBusiness(data, user.id);
    },

    async updateSelfEmployedBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'SelfEmployedBusiness');

      _updateBusiness(id, data);
    },

    async addChildEducationBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'ChildEducationBusiness';

      _addBusiness(data, user.id);
    },

    async updateChildEducationBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'ChildEducationBusiness');

      _updateBusiness(id, data);
    },

    async addDomesticHelpBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'DomesticHelpBusiness';

      _addBusiness(data, user.id);
    },

    async updateDomesticHelpBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'DomesticHelpBusiness');

      if (data["personnel"] || data["old_personnel"]) {
        try {
          data = await _processUpdatedPersonnel(id, data);
        }
        catch(e) {
          console.log(e);
          throw new ApolloError(
            "Failed to update business",
            'PERSONNEL_UPDATE_ERROR'
          );
        }
      }

      if (Object.keys(data).length > 0) {
        _updateBusiness(id, data);
      }
      else {
        Mailer.businessUpdate(user, id, true);
      }
    },

    async addBeautyBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'BeautyBusiness';

      _addBusiness(data, user.id);
    },

    async updateBeautyBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'BeautyBusiness');

      _updateBusiness(id, data);
    },

    async addTransportationBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'TransportationBusiness';

      _addBusiness(data, user.id);
    },

    async updateTransportationBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'TransportationBusiness');

      _updateBusiness(id, data);
    },

    async addHospitalityBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'HospitalityBusiness';

      _addBusiness(data, user.id);
    },

    async updateHospitalityBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'HospitalityBusiness');

      _updateBusiness(id, data);
    },

    async addStationeryBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'StationeryBusiness';
      data.sub_type = 'Stationery';

      _addBusiness(data, user.id);
    },

    async updateStationeryBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'StationeryBusiness');

      _updateBusiness(id, data);
    },

    async addMadeInQatarBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'MadeInQatarBusiness';

      _addBusiness(data, user.id);
    },

    async updateMadeInQatarBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'MadeInQatarBusiness');

      _updateBusiness(id, data);
    },

    async addSportsBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SportsBusiness';

      _addBusiness(data, user.id);
    },

    async updateSportsBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'SportsBusiness');

      _updateBusiness(id, data);
    },

    async addEntertainmentBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'EntertainmentBusiness';

      _addBusiness(data, user.id);
    },

    async updateEntertainmentBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'EntertainmentBusiness');

      _updateBusiness(id, data);
    },

    async addFoodBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'FoodBusiness';

      _addBusiness(data, user.id);
    },

    async updateFoodBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'FoodBusiness');

      _updateBusiness(id, data);
    },

    async addCleaningAndMaintenanceBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'CleaningAndMaintenanceBusiness';

      _addBusiness(data, user.id);
    },

    async updateCleaningAndMaintenanceBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'CleaningAndMaintenanceBusiness');

      _updateBusiness(id, data);
    },

    async addEvent(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      _addEvent(data, user.id);
    },

    async updateEvent(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateEventOwner(user, id);

      _updateEvent(id, data);
    },

    // admin mutations

    async authenticateAdmin(_, { key }) {
      if (key == "admin") {
        // return json web token
        return jsonwebtoken.sign(
          { type: 'ADMIN' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
      }
      else {
        throw new ApolloError(
          "Invalid admin key.",
          'ADMIN_LOGIN_REJECTED'
        );
      }
    },

    async reviewBusiness(_, { id, approve }, { user }) {
      _validateAuthenticatedAdmin(user);

      var business = await businessLoader.load(id);

      if (business.approved == 'TENTATIVE' || business.approved == 'REJECTED') {
        try {
          await db.query(
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

          businessLoader.clear(id);

          Mailer.businessAdd(
            (await businessUserLoader.load(business.owner)).email,
            business.display_name,
            approve
          );
        }
        catch (e) {
          console.log(e);
          throw new ApolloError(
            "Failed to approve business.",
            "BUSINESS_APPROVE_FAILED"
          );
        }
      }

      try {
        const result = await db.query(
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

        if (result.affectedRows == 1) {
          if (approve) {

            var data = await db.query(
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
                var oldBusiness = await businessLoader.load(id);
          
                if (oldBusiness.attachments) {
                  data.attachments = _updateAttachments(
                    oldBusiness.attachments,
                    data.old_attachments || [],
                    data.attachments || []
                  );
                }
          
                if (data.old_attachments) delete data.old_attachments;
              }

              await db.query(
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

            await db.query(
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

            await db.query(
              `
              DELETE FROM
                business_tentative_update
              WHERE
                business_id = ?
              `,
              [ id ]
            );

            businessLoader.clear(id);

            Mailer.businessUpdate(
              (await businessUserLoader.load(business.owner)).email,
              business.display_name,
              approve
            );
          }
        }
      }
      catch (e) {
        console.log(e);
        throw new ApolloError(
          "Failed to approve business update.",
          "BUSINESS_UPDATE_APPROVE_FAILED"
        );
      }
    },

    async reviewEvent(_, { id, approve }, { user }) {
      _validateAuthenticatedAdmin(user);

      var event = await eventLoader.load(id);

      if (event.approved == 'TENTATIVE' || event.approved == 'REJECTED') {
        try {
          await db.query(
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

          eventLoader.clear(id);

          Mailer.eventAdd(
            (await businessUserLoader.load(event.owner)).email,
            event.display_name,
            approve
          );
        }
        catch (e) {
          console.log(e);
          throw new ApolloError(
            "Failed to approve event.",
            "EVENT_APPROVE_FAILED"
          );
        }
      }
      else {
        throw new ApolloError(
          "Event already approved.",
          "DUPLICATE_EVENT_APPROVE"
        );
      }
    }
  },

  Upload: GraphQLUpload,

  Void: new GraphQLScalarType({
      name: 'Void',

      description: 'Represents a void',

      serialize() {
        return null
      },

      parseValue() {
        return null
      },

      parseLiteral() {
        return null
      }
  }),

  User: {
    async rating(_, { businessId }, { user }) {
      _validateAuthenticatedPublicUser(user);

      const rows = await db.query(
        `
        SELECT
          stars
        FROM
          rating
        WHERE
          business_id = ?
          AND public_user_id = ?
        `,
        [businessId, user.id]
      );

      if (rows.length == 1) {
        return rows[0].stars;
      }
    },

    async owned_businesses(_, args, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var businessUser = await businessUserLoader.load(user.id);
      if (! businessUser.owned_businesses) {
        const rows = await db.query(
          `
          SELECT
            id
          FROM
            business
          WHERE
            owner = ?
          `,
          [ user.id ]
        );

        businessUser.owned_businesses = rows.map (_ => _.id);
        businessUserLoader.clear(user.id).prime(user.id, businessUser);
      }

      return businessUser.owned_businesses.map(_ => businessLoader.load(_));
    },

    async owned_events(_, args, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var businessUser = await businessUserLoader.load(user.id);
      if (! businessUser.owned_events) {
        const rows = await db.query(
          `
          SELECT
            id
          FROM
            event
          WHERE
            owner = ?
          `,
          [ user.id ]
        );

        businessUser.owned_events = rows.map (_ => _.id);
        businessUserLoader.clear(user.id).prime(user.id, businessUser);
      }

      return businessUser.owned_events.map(_ => eventLoader.load(_));
    },

    async threads(_, { threadId }, { user }) {
      if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      if (user.type == 'BUSINESS') {
        if (threadId) {
          var thread = await msgThreadLoader.load(threadId);
          if (thread.business_user_id == user.id) {
            return [ thread ];
          }
          else {
            throw new ApolloError(
              "You are not the owner of this thread",
              "BUSINESS_USER_NOT_THREAD_OWNER"
            );
          }
        }
        else {
          const rows = await db.query(
            `
            SELECT
              id
            FROM
              message_thread
            WHERE
              business_user_id = ?
            `,
            [ user.id ]
          );

          return msgThreadLoader.loadMany(rows.map(_ => _.id));
        }
      }
      else {
        if (threadId) {
          var thread = await msgThreadLoader.load(threadId);
          if (thread.public_user_id == user.id) {
            return [ thread ];
          }
          else {
            throw new ApolloError(
              "You are not the owner of this thread",
              "PUBLIC_USER_NOT_THREAD_OWNER"
            );
          }
        }
        else {
          const rows = await db.query(
            `
            SELECT
              id
            FROM
              message_thread
            WHERE
              public_user_id = ?
            `,
            [ user.id ]
          );

          return msgThreadLoader.loadMany(rows.map(_ => _.id));
        }
      }
    }
  },

  MessageThread: {
    sender: async(parent, args, ctx) => {
      user = await publicUserLoader.load(parent.public_user_id)
      if (user.first_name && user.last_name) {
        return user.first_name + ' ' + user.last_name
      }
      else {
        return "DarQ User";
      }
    },
    target: async(parent, args, ctx) => await businessLoader.load(parent.business_id),
    messages: async(parent, { minIndex, maxIndex, limit }, ctx) => {
      var messages = await msgLoader.load(parent.id);

      var low;
      if (minIndex != null) low = minIndex + 1;
      else if (maxIndex != null) low = Math.min(maxIndex, messages.length) - limit;
      else low = messages.length - limit;

      if (low < 0) low = 0;

      return messages.slice(low, maxIndex);
    }
  },

  Admin: {
    async tentativeNewBusinesses() {
      const rows = await db.query(
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
    },

    async tentativeBusinessUpdates() {
      const rows = await db.query(
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

      return rows.map(row => businessLoader.load(row.business_id));
    },

    async tentativeNewEvents() {
      const rows = await db.query(
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
  },

  Business: {
    __resolveType(obj, { user }, info) {
      if (user.type == 'PUBLIC') return obj.type;
      else return obj.type + '_noLocale';
    },

    async update(parent, args, { user }) {
      _validateAuthenticatedBusinessUserOrAdmin(user);

      const rows = await db.query(
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
        [ parent.id ]
      );

      if (rows.length == 1) {
        return { ...parent, ...JSON.parse(rows[0].data) };
      }
    }
  },

  DomesticHelpPersonnel: {
    __resolveType(obj, ctx, info) {
      return obj.profession;
    }
  },
  DomesticHelpPersonnel_noLocale: {
    __resolveType(obj, ctx, info) {
      return obj.profession + "_noLocale";
    }
  }
}

module.exports = resolvers;
