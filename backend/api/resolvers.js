require('dotenv').config();
const bcrypt = require('bcrypt');
const cryptoRandomString = require('crypto-random-string');
const jsonwebtoken = require('jsonwebtoken');
const { ApolloError, GraphQLUpload } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');

const Locale = require('./locale');
const Model = require('./model');
const Mailer = require('./mailer');

function scheduleMaintenance() {
  Model.startMaintenance().then(() => {
    // schedule next maintenance
    // TODO: change when deploying; run every 60 seconds, for development
    setTimeout(scheduleMaintenance, 60000);
  });
}

// cold-start maintenance starts 60 seconds after server startup
setTimeout(scheduleMaintenance, 60000);

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
  var business = await Model.businessLoader.load(businessId);
  if (business.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this business! This incident will be reported.",
      'NOT_BUSINESS_OWNER'
    );
  }
}

async function _validateBusinessOwnerAndType(user, businessId, type) {
  var business = await Model.businessLoader.load(businessId);
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
  var event = await Model.eventLoader.load(eventId);
  if (event.owner != user.id) {
    throw new ApolloError(
      "You're not the owner of this event! This incident will be reported.",
      'NOT_EVENT_OWNER'
    );
  }
}

const resolvers = {
  Query: {
    async user(_, args, { user }) {
      if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      if (user.type == 'BUSINESS') {
        var businessUser = await Model.businessUserLoader.load(user.id);
        businessUser.type = user.type;
        return businessUser;
      }
      else if (user.type == 'PUBLIC') {
        var publicUser = await Model.publicUserLoader.load(user.id);
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

      return Locale.apply(await Model.businessLoader.load(id), user.locale);
    },

    async businesses(_, { limit, offset, type, sub_types }, { user }) {
      _validateAuthenticatedPublicUser(user);

      var res = [];

      if (sub_types) {
        var count = 0;
        var realOffset = 0;

        // find the real offset according to this filter
        while (count < offset) {
          var arr = await Model.orderedBusinessLoader.get(type).loadMany(
            Array.from(Array(offset - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var b = await Model.businessLoader.load(id);
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
          var arr = await Model.orderedBusinessLoader.get(type).loadMany(
            Array.from(Array(limit - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var b = await Model.businessLoader.load(id);
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
        res = (await Model.orderedBusinessLoader.get(type).loadMany(
          Array.from(Array(limit), (_, i) => i + offset)
        )).map(_ => _ ? Model.businessLoader.load(_) : null);
      }

      res = res.filter(_ => _ != null);

      for (var i = 0; i < res.length; ++i) {
        res[i] = Locale.apply(await res[i], user.locale);
      }

      return res;
    },

    async event(_, { id }, { user }) {
      _validateAuthenticatedPublicUser(user);

      return Locale.apply(await Model.eventLoader.load(id), user.locale);
    },

    async events(_, { limit, offset, type }, { user }) {
      _validateAuthenticatedPublicUser(user);

      var res = [];

      if (type) {
        var count = 0;
        var realOffset = 0;

        // find the real offset according to this filter
        while (count < offset) {
          var arr= await Model.orderedEventLoader.loadMany(
            Array.from(Array(offset - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var e = await Model.eventLoader.load(id);
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
          var arr = await Model.orderedEventLoader.loadMany(
            Array.from(Array(limit - count), (_, i) => i + realOffset)
          );

          for (var id of arr) {
            if (id) {
              var e = await Model.eventLoader.load(id);
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
        res = (await Model.orderedEventLoader.loadMany(
          Array.from(Array(limit), (_, i) => i + offset)
        )).map(_ => _ ? Model.eventLoader.load(_) : null);
      }

      res = res.filter(_ => _ != null);

      for (var i = 0; i < res.length; ++i) {
        res[i] = Locale.apply(await res[i], user.locale);
      }

      return res;
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

      await Model.db.query(
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

        var business = await Model.businessLoader.load(targetBusinessId);

        const result = await Model.db.query(
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

      var thread = await Model.msgThreadLoader.load(threadId);

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

      var messages = await Model.msgLoader.load(thread.id);
      var m = {
        index: messages.length > 0 ? messages[messages.length - 1].index + 1 : 0,
        msg: msg,
        time: new Date(),
        sender: user.type
      };

      messages.push(m);
      Model.msgLoader
        .clear(thread.id)
        .prime(thread.id, messages);

      Model.db.query(
        `
        INSERT INTO
          message(message_thread_id, create_time, sender, data)
        VALUES
          (?, ?, ?, ?)
        `,
        [ thread.id, m.time, m.sender, m.msg ]
      );

      if (user.type == 'BUSINESS') return Model.targetSeeMessage(thread, m.index);
      else return Model.senderSeeMessage(thread, m.index);
    },

    async seeMessage(_, { threadId, index }, { user }) {
      if (! user) {
        throw new ApolloError(
          "Sorry... You're not authenticated! :c",
          'USER_NOT_AUTHENTICATED'
        );
      }

      var thread = await Model.msgThreadLoader.load(threadId);

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

        return Model.targetSeeMessage(thread, index);
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

        return Model.senderSeeMessage(thread, index);
      }
      else {
        throw new ApolloError(
          "I'm sorry. I made a boom boom. :(",
          'INVALID_USER_TYPE'
        );
      }
    },

    async setLocale(_, { locale }, { user }) {
      _validateAuthenticatedPublicUser(user);

      return jsonwebtoken.sign(
        { id: user.id, type: 'PUBLIC', locale: locale },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async createPublicUser(_, { locale }) {
      var id = cryptoRandomString({length: 18, type: 'numeric'});
      while (id.charAt(0) == '0') cryptoRandomString({length: 18, type: 'numeric'})

      try {
        await Model.db.query(
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

    async authenticatePublicUser(_, { id, locale }) {
      var valid = false;
      try {
        const result = await Model.db.query(
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
        Model.publicUserLoader.clear(id);

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

    async createBusinessUser(_, { email, password }) {
      const token = cryptoRandomString({length: 128, type: 'url-safe'});

      try {
        const result = await Model.db.query(
          "INSERT INTO business_user (email, password, token) VALUES (?, ?, ?)",
          [ email, await bcrypt.hash(password, 10), token ]
        );

        Mailer.newUser(email, token);
      }
      catch(e) {
        console.log(e);
        throw new ApolloError("Failed to signup.", 'BUSINESS_USER_SIGNUP_FAILED');
      }
    },

    async verifyBusinessUser(_, { email, token }) {
      var result;
      try {
        result = await Model.db.query(
          "SELECT id, verified, token FROM business_user WHERE email=?",
          [ email ]
        );
      }
      catch(e) {
        console.log(e);
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
        await Model.db.query(
          `
          UPDATE
            business_user
          SET
            last_login=CURRENT_TIMESTAMP,
            token=NULL,
            verified=1
          WHERE id=?
          `, [ id ]
        );
      }
      catch(e) {
        console.log(e);
        throw new ApolloError(
          "Failed to verify user.",
          'BUSINESS_USER_VERIFY_FAILED'
        );
      }

      // delete cached information
      Model.businessUserLoader.clear(id);

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'BUSINESS' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async authenticateBusinessUser(_, { email, password }) {
      var result;
      try {
        result = await Model.db.query(
          "SELECT id, verified, password FROM business_user WHERE email=?",
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
        Model.db.query(
          "UPDATE business_user SET last_login=CURRENT_TIMESTAMP WHERE id=?",
          [ id ]
        );
      }
      catch(e) {
        console.log(e);
      }

      // delete cached information
      Model.businessUserLoader.clear(id);

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'BUSINESS' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async changeBusinessUserPassword(_, { oldPassword, newPassword }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var result;
      try {
        result = await Model.db.query(
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
          await Model.db.query(
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

    async requestBusinessUserPasswordReset(_, { email }) {
      var result;
      try {
        result = await Model.db.query(
          "SELECT id, verified FROM business_user WHERE email=?",
          [ email ]
        );
      }
      catch(e) {
        console.log(e);
        return;
      }

      if (result.length != 1 || result[0].verified == 0) {
        return;
      }

      const id = result[0].id;
      const token = cryptoRandomString({length: 128, type: 'url-safe'});

      try {
        await Model.db.query(
          `
          UPDATE
            business_user
          SET
            token=?
          WHERE id=?
          `,
          [ token, id ]
        );
      }
      catch(e) {
        console.log(e);
        return;
      }

      // delete cached information
      Model.businessUserLoader.clear(id);

      Mailer.resetPassword(email, token);
    },

    async resetBusinessUserPassword(_, { email, token, newPassword }) {
      var result;
      try {
        result = await Model.db.query(
          "SELECT id, verified, token FROM business_user WHERE email=?",
          [ email ]
        );
      }
      catch(e) {
        console.log(e);
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
        await Model.db.query(
          `UPDATE
            business_user
          SET
            password=?,
            token=NULL
          WHERE id=?
          `,
          [ await bcrypt.hash(newPassword, 10), id ]
        );
      }
      catch(e) {
        console.log(e);
        throw new ApolloError(
          "Failed to reset password.",
          'BUSINESS_USER_PASSWORD_REST_FAILURE'
        );
      }

      // delete cached information
      Model.businessUserLoader.clear(id);

      // return json web token
      return jsonwebtoken.sign(
        { id: id, type: 'BUSINESS' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async addSelfEmployedBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SelfEmployedBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateSelfEmployedBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'SelfEmployedBusiness');

      await Model.updateBusiness(id, data);
    },

    async addChildEducationBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'ChildEducationBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateChildEducationBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'ChildEducationBusiness');

      await Model.updateBusiness(id, data);
    },

    async addDomesticHelpBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      if (data["personnel"]) {
        for (var p of data["personnel"]) {
          if (p.profession == 'Driver') {
            if (p.license_expiry_date === undefined || p.license_expiry_date === null) {
              throw new ApolloError(
                "Missing field 'license_expiry_date' in personnel[profession=Driver]",
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }
          }
          else {
            if (p.education === undefined || p.education === null) {
              throw new ApolloError(
                `Missing field 'education' in personnel[profession=${p.profession}]`,
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }

            if (p.height === undefined || p.height === null) {
              throw new ApolloError(
                `Missing field 'height' in personnel[profession=${p.profession}]`,
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }

            if (p.weight === undefined || p.weight === null) {
              throw new ApolloError(
                `Missing field 'weight' in personnel[profession=${p.profession}]`,
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }

            if (p.skills === undefined || p.skills === null) {
              throw new ApolloError(
                `Missing field 'education' in personnel[profession=${p.profession}]`,
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }

            if (p.number_of_children === undefined || p.number_of_children === null) {
              throw new ApolloError(
                `Missing field 'number_of_children' in personnel[profession=${p.profession}]`,
                'DOMESTIC_HELP_PERSONNEL_DATA_VALIDATION_ERROR'
              );
            }
          }
        }
      }

      data.type = 'DomesticHelpBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateDomesticHelpBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'DomesticHelpBusiness');

      if (data["personnel"] || data["old_personnel"]) {
        try {
          data = await Model.updateDomesticHelpPersonnel(id, data);
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
        await Model.updateBusiness(id, data);
      }
      else {
        Mailer.businessUpdate(
          (await Model.businessUserLoader.load(user.id)).email,
          (await Model.businessLoader.load(id)).display_name,
          true
        );
      }
    },

    async addBeautyBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'BeautyBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateBeautyBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'BeautyBusiness');

      await Model.updateBusiness(id, data);
    },

    async addTransportationBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'TransportationBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateTransportationBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'TransportationBusiness');

      await Model.updateBusiness(id, data);
    },

    async addHospitalityBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'HospitalityBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateHospitalityBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'HospitalityBusiness');

      await Model.updateBusiness(id, data);
    },

    async addStationeryBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'StationeryBusiness';
      data.sub_type = 'Stationery';

      await Model.addBusiness(data, user.id);
    },

    async updateStationeryBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'StationeryBusiness');

      await Model.updateBusiness(id, data);
    },

    async addMadeInQatarBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'MadeInQatarBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateMadeInQatarBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'MadeInQatarBusiness');

      await Model.updateBusiness(id, data);
    },

    async addSportsBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'SportsBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateSportsBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'SportsBusiness');

      await Model.updateBusiness(id, data);
    },

    async addEntertainmentBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'EntertainmentBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateEntertainmentBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'EntertainmentBusiness');

      await Model.updateBusiness(id, data);
    },

    async addFoodBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'FoodBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateFoodBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'FoodBusiness');

      await Model.updateBusiness(id, data);
    },

    async addCleaningAndMaintenanceBusiness(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      data.type = 'CleaningAndMaintenanceBusiness';

      await Model.addBusiness(data, user.id);
    },

    async updateCleaningAndMaintenanceBusiness(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwnerAndType(user, id, 'CleaningAndMaintenanceBusiness');

      await Model.updateBusiness(id, data);
    },

    async addEvent(_, { data }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      await Model.addEvent(data, user.id);
    },

    async updateEvent(_, { id, data }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateEventOwner(user, id);

      await Model.updateEvent(id, data);
    },

    // admin mutations

    async authenticateAdmin(_, { key }) {
      if (key == process.env.ADMIN_KEY) {
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

      var business = await Model.businessLoader.load(id);

      if (business.approved == 'TENTATIVE' || business.approved == 'REJECTED') {
        try {
          await Model.db.query(
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

          Model.businessLoader.clear(id);

          Mailer.businessAdd(
            (await Model.businessUserLoader.load(business.owner)).email,
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
        const result = await Model.db.query(
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

            var data = await Model.db.query(
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
                var oldBusiness = await Model.businessLoader.load(id);

                if (oldBusiness.attachments) {
                  data.attachments = _updateAttachments(
                    oldBusiness.attachments,
                    data.old_attachments || [],
                    data.attachments || []
                  );
                }

                if (data.old_attachments) delete data.old_attachments;
              }

              await Model.db.query(
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

            await Model.db.query(
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

            await Model.db.query(
              `
              DELETE FROM
                business_tentative_update
              WHERE
                business_id = ?
              `,
              [ id ]
            );

            Model.businessLoader.clear(id);

            Mailer.businessUpdate(
              (await Model.businessUserLoader.load(business.owner)).email,
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

      var event = await Model.eventLoader.load(id);

      if (event.approved == 'TENTATIVE' || event.approved == 'REJECTED') {
        try {
          await Model.db.query(
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

          Model.eventLoader.clear(id);

          Mailer.eventAdd(
            (await Model.businessUserLoader.load(event.owner)).email,
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

      const rows = await Model.db.query(
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

      var businessUser = await Model.businessUserLoader.load(user.id);
      if (! businessUser.owned_businesses) {
        const rows = await Model.db.query(
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
        Model.businessUserLoader.clear(user.id).prime(user.id, businessUser);
      }

      return businessUser.owned_businesses.map(_ => Model.businessLoader.load(_));
    },

    async owned_events(_, args, { user }) {
      _validateAuthenticatedBusinessUser(user);

      var businessUser = await Model.businessUserLoader.load(user.id);
      if (! businessUser.owned_events) {
        const rows = await Model.db.query(
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
        Model.businessUserLoader.clear(user.id).prime(user.id, businessUser);
      }

      return businessUser.owned_events.map(_ => Model.eventLoader.load(_));
    },

    async threads(_, { threadId }, { user }) {
      if (! user) {
        throw new ApolloError("Sorry... You're not authenticated! :c", 'USER_NOT_AUTHENTICATED');
      }

      if (user.type == 'BUSINESS') {
        if (threadId) {
          var thread = await Model.msgThreadLoader.load(threadId);
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
          const rows = await Model.db.query(
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

          return Model.msgThreadLoader.loadMany(rows.map(_ => _.id));
        }
      }
      else {
        if (threadId) {
          var thread = await Model.msgThreadLoader.load(threadId);
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
          const rows = await Model.db.query(
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

          return Model.msgThreadLoader.loadMany(rows.map(_ => _.id));
        }
      }
    }
  },

  MessageThread: {
    sender: async(parent, args, ctx) => {
      user = await Model.publicUserLoader.load(parent.public_user_id)
      if (user.first_name && user.last_name) {
        return user.first_name + ' ' + user.last_name
      }
      else {
        return "DarQ User";
      }
    },
    target: async(parent, args, ctx) => await Model.businessLoader.load(parent.business_id),
    messages: async(parent, { minIndex, maxIndex, limit }, ctx) => {
      var messages = await Model.msgLoader.load(parent.id);

      var low;
      if (minIndex != null) low = minIndex + 1;
      else if (maxIndex != null) low = Math.min(maxIndex, messages.length) - limit;
      else low = messages.length - limit;

      if (low < 0) low = 0;
      if (maxIndex == null) maxIndex = low + limit;

      return messages.slice(low, maxIndex);
    }
  },

  Admin: {
    async tentativeNewBusinesses() {
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
          approved = 'TENTATIVE' OR
          approved = 'REJECTED'
        `
      );

      return rows.map(row => JSON.parse(row.data));
    },

    async tentativeBusinessUpdates() {
      const rows = await Model.db.query(
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

      return rows.map(row => Model.businessLoader.load(row.business_id));
    },

    async tentativeNewEvents() {
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

      const rows = await Model.db.query(
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
