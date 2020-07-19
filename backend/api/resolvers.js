require('dotenv').config()
var mysql = require('mysql');
const DataLoader = require('dataloader')
const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string');
const jsonwebtoken = require('jsonwebtoken');
const { ApolloError } = require('apollo-server-express');

class Database {
  constructor(config) {
      this.connection = mysql.createConnection( config );
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
          if (err) return reject(err);
          resolve();
      });
    });
  }
}

var db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const businessUserLoader = new DataLoader(
  async (ids) => {
    return ids.map((id) => {
      return db.query(
        "SELECT * FROM business_user WHERE id = ?",
        [ id ]
      ).then(rows => rows[0]);
    });
  }
);

const publicUserLoader = new DataLoader(
  async (ids) => {
    return ids.map((id) => {
      return db.query(
        "SELECT * FROM public_user WHERE id = ?",
        [ id ]
      ).then(rows => rows[0]);
    });
  }
);

const businessLoader = new DataLoader(
  async (ids) => {
    return ids.map((id) => {
      return db.query(
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
        [ id ]
      ).then(rows => JSON.parse(rows[0].data));
    });
  }
);

const eventLoader = new DataLoader(
  async (ids) => {
    return ids.map((id) => {
      return db.query(
        `
          SELECT
          JSON_INSERT(
            props,
            '$.id', id,
            '$.owner', owner,
            '$.display_name', display_name,
            '$.display_picture', display_picture,
            '$.type', \`type\`,
            '$.city', city,
            '$.start', start,
            '$.end', end,
          ) AS data
        FROM
            event
          WHERE
            id = ?
        `,
        [ id ]
      ).then(rows => JSON.parse(rows[0].data));
    });
  }
);

function _validateAuthenticatedBusinessUser(user) {
  if (! user || user.type != 'business') {
    throw new ApolloError("No or invalid authentication", 'USER_NOT_AUTHENTICATED');
  }
}

function _validateAuthenticatedPublicUser(user) {
  if (! user || user.type != 'public') {
    throw new ApolloError("No or invalid authentication", 'USER_NOT_AUTHENTICATED');
  }
}

function _validateBusinessOwner(user, businessId) {
  var business = await businessLoader.load(businessId);
  if (business.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this business! This incident will be reported.", 
      'NOT_BUSINESS_OWNER'
    );
  }
}

function _validateBusinessOwnerAndType(user, businessId, type) {
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

function _validateEventOwner(user, eventId) {
  var event = await eventLoader.load(eventId);
  if (event.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this event! This incident will be reported.", 
      'NOT_EVENT_OWNER'
    );
  }
}

async function _addBusiness(data, owner) {
  try {
    var props = data;

    var display_name = data.display_name; delete props.display_name;
    var display_picture = data.display_picture; delete props.display_picture;
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

    // TODO: send confirmation email

    return id;
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to add businesss.", 'ADD_BUSINESS_FAILED');
  }
}

async function _updateBusiness(id, data) {
  try {
    var stringifiedData = JSON.stringify(data);
    await db.query(
      `
        INSERT INTO business_tentative_update
          (business_id, updated_data)
        VALUES
          (?, ?)
        ON DUPLICATE KEY UPDATE
          updated_data = JSON_MERGE_PATCH(updated_data, ?)
      `,
      [
        id,
        stringifiedData,
        stringifiedData
      ]
    );

    // TODO: send confirmation email
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to update businesss.", 'UPDATE_BUSINESS_FAILED');
  }
}

async function _addEvent(data, owner) {
  try {
    var props = data;

    var display_name = data.display_name; delete props.display_name;
    var display_picture = data.display_picture; delete props.display_picture;
    var type = data.type; delete props.type;
    var city = data.city; delete props.city;
    var start = data.start; delete props.start;
    var end = data.end; delete props.end;

    const result = await db.query(
      `
        INSERT INTO event
          (
            owner,
            display_name,
            display_picture,
            type,
            city,
            start,
            end,
            props
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        owner,
        display_name,
        display_picture,
        type,
        city,
        start,
        end,
        JSON.stringify(props),
      ]
    );
    id = result.insertId;

    // TODO: send confirmation email

    return id;
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to add event.", 'ADD_EVENT_FAILED');
  }
}

async function _updateEvent(id, data) {
  try {
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

    if (data.city) {
      fields.push("city = ?");
      args.push(data.city);
      delete data.city;
    }

    if (data.start) {
      fields.push("start = ?");
      args.push(data.start);
      delete data.start;
    }

    if (data.end) {
      fields.push("end = ?");
      args.push(data.end);
      delete data.end;
    }

    if (Object.keys(data).length > 0) {
      fields.push("props = JSON_MERGE_PATCH(props, ?)");
      args.push(JSON.stringify(data));
    }

    args.push(id);

    await db.query("UPDATE event SET " + fields.join(', ') + " WHERE id = ?;", args);

    // TODO: send confirmation email
  }
  catch(e) {
    console.log(e);
    throw new ApolloError("Failed to update event.", 'UPDATE_EVENT_FAILED');
  }
}

const resolvers = {
  Query: {
    async user(_, args, { user }) {
      if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      if (user.type == 'business') {
        var businessUser = await businessUserLoader.load(user.id);
        businessUser.type = user.type;
        return businessUser;
      }
      else if (user.type == 'public') {
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

    async businesses(_, { limit, offset, type, sub_type }, { user }) {
      _validateAuthenticatedPublicUser();

      var result;
      if (type && sub_type) {
        result = await db.query(
          `
            SELECT
              JSON_INSERT(
                props,
                '$.id', id,
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
              type = ? AND
              sub_type = ?
            LIMIT ?
            OFFSET ?
          `,
          [type, sub_type, limit, offset]
        );
      }
      else if (type) {
        result = await db.query(
          `
            SELECT
              JSON_INSERT(
                props,
                '$.id', id,
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
              type = ?
            LIMIT ?
            OFFSET ?
          `,
          [type, limit, offset]
        );
      }
      else {
        result = await db.query(
          `
            SELECT
              JSON_INSERT(
                props,
                '$.id', id,
                '$.approved', approved,
                '$.rating', calculated_rating,
                '$.display_name', display_name,
                '$.display_picture', display_picture,
                '$.type', \`type\`,
                '$.sub_type', sub_type
              ) AS data
            FROM
              business
            LIMIT ?
            OFFSET ?
          `,
          [limit, offset]
        );
      }

      return result.map(row => JSON.parse(row.data))
    },

    async events(_, { limit, offset, type }, { user }) {
      _validateAuthenticatedPublicUser(user);

      return [];
    }
  },

  Mutation: {
    async createPublicUser() {
      const id = cryptoRandomString({length: 18, type: 'numeric'})

      try {
        const rows = await db.query(
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
        { id: id, type: 'public' },
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

        // TODO: send confirmation email
      }
      catch(e) {
        console.log(e);
        throw new ApolloError("Failed to signup.", 'BUSINESS_USER_SIGNUP_FAILED');
      }

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'business' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async authenticatePublicUser(_, { id }) {
      try {
        const result = await db.query(
          "UPDATE public_user SET last_login=CURRENT_TIMESTAMP WHERE id=?",
          [ id ]
        );

        if (result.affectedRows == 1) {
          // clear cached data
          publicUserLoader.clear(id);

          // return json web token
          return jsonwebtoken.sign(
            { id: id, type: 'public' },
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
      }
      catch(e) {
        throw new ApolloError(
          "Failed to login.",
          'PUBLIC_USER_LOGIN_FAILED'
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
        catch(e) { }

        // delete cached information
        businessUserLoader.clear(id);

        // return json web token
        return jsonwebtoken.sign(
          { id: id, type: 'business' },
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

      // TODO: implement
    },

    async addSelfEmployedBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SelfEmployedBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateSelfEmployedBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'SelfEmployedBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addChildEducationBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'ChildEducationBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateChildEducationBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'ChildEducationBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addDomesticHelpBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'DomesticHelpBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateDomesticHelpBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'DomesticHelpBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addBeautyBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'BeautyBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateBeautyBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'BeautyBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addLimousineBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'LimousineBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateLimousineBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'LimousineBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addHospitalityBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'HospitalityBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateHospitalityBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'HospitalityBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addStationaryBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'StationaryBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateStationaryBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'StationaryBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addMadeInQatarBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'MadeInQatarBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateMadeInQatarBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'MadeInQatarBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addSportsBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SportsBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateSportsBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'SportsBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addEntertainmentBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'EntertainmentBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateEntertainmentBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'EntertainmentBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addFoodBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'FoodBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateFoodBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'FoodBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addMaintenanceBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'MaintenanceBusiness';

      var id = await _addBusiness(data, user.id);
      var business = await businessLoader.load(id);
      return business;
    },

    async updateMaintenanceBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateBusinessOwnerAndType(user, id, 'MaintenanceBusiness');

      id = await _updateBusiness(id, data);
      var business = await businessLoader.load(id);
      return business;
    },

    async addEvent(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var id = await _addEvent(data, user.id);
      var event = await eventLoader.load(id);
      return event;
    },

    async updateEvent(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      _validateEventOwner(user, id);

      id = await _updateEvent(id, data);
      var event = await eventLoader.clear(id).load(id);
      return event;
    }
  },

  Business: {
    __resolveType(obj, ctx, info) {
      return obj.type;
    }
  },

  DomesticHelpPersonnel: {
    __resolveType(obj, ctx, info) {
      return obj.profession;
    }
  },
}

module.exports = resolvers;
