require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const { ApolloError, GraphQLUpload } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');

const Locale = require('./locale');
const Model = require('./model');
const Mailer = require('./mailer');

function scheduleMaintenance() {
  Model.startMaintenance().then(() => {
    // schedule next maintenance
    // TODO: change when deploying; run every 120 seconds, for development
    setTimeout(scheduleMaintenance, 120000);
  });
}

// cold-start maintenance starts 10 seconds after server startup
setTimeout(scheduleMaintenance, 10000);

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
        throw new ApolloError(
          "Sorry... You're not authenticated! :c",
          'USER_NOT_AUTHENTICATED'
        );
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

      var count = 0;
      var realOffset = 0;

      // find the real offset according to this filter
      while (count < offset) {
        var more = await Model.getOrderedBusinesses(type, realOffset, offset - count);
        if (more.length == 0) break;

        for (var b of more) {
          if (b) {
            if (! sub_types || sub_types.includes(b.sub_type)) {
              ++count;
            }
            ++realOffset;
          }
          else {
            count = offset;
            break;
          }
        }
      }

      // collect businesses
      count = 0;
      while (count < limit) {
        var more = await Model.getOrderedBusinesses(type, realOffset, limit - count);
        if (more.length == 0) break;

        // ids of businesses with correct sub_type
        var ids = [];

        for (var b of more) {
          if (b) {
            if (! sub_types || sub_types.includes(b.sub_type)) {
              ids.push(b.id);
            }
            ++realOffset;
          }
          else {
            count = limit;
            break;
          }
        }

        // load businesses and validate that every one is
        // listed (may be deleted or other)
        more = await Model.businessLoader.loadMany(ids);
        for (var b of more) {
          if (b.status == 'LISTED') {
            res.push(b);
            ++count;
          }
        }
      }

      for (var i = 0; i < res.length; ++i) {
        res[i] = Locale.apply(res[i], user.locale);
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

      var count = 0;
      var realOffset = 0;

      // find the real offset according to this filter
      while (count < offset) {
        var more = await Model.getOrderedEvents(realOffset, offset - count);
        if (more.length == 0) break;

        for (var e of more) {
          if (e) {
            if (! type || type == e.type) {
              ++count;
            }
            ++realOffset;
          }
          else {
            count = offset;
            break;
          }
        }
      }

      // collect events
      count = 0;
      while (count < limit) {
        var more = await Model.getOrderedEvents(realOffset, limit - count);
        if (more.length == 0) break;

        // ids of events with correct type
        var ids = [];

        for (var e of more) {
          if (e) {
            if (! type || type == e.type) {
              ids.push(e.id);
            }
            ++realOffset;
          }
          else {
            count = limit;
            break;
          }
        }

        // load events and validate that every one is
        // listed (may be deleted or other)
        more = await Model.eventLoader.loadMany(ids);
        for (var e of more) {
          if (e.status == 'LISTED') {
            res.push(e);
            ++count;
          }
        }
      }

      var res = await Model.eventLoader.loadMany(ids);

      for (var i = 0; i < res.length; ++i) {
        res[i] = Locale.apply(res[i], user.locale);
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

      await Model.setBusinessRating(user.id, id, stars);
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

        threadId = await Model.createMessageThread(targetBusinessId, user.id);
      }
      else if (! user) {
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

      const index = await Model.addMessageToThread(thread.id, msg, user.type);

      if (user.type == 'BUSINESS') {
        return Model.setThreadSeeIndexForTarget(thread, index);
      }
      else {
        return Model.setThreadSeeIndexForSender(thread, index);
      }
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

        return Model.setThreadSeeIndexForTarget(thread, index);
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

        return Model.setThreadSeeIndexForSender(thread, index);
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

      return jsonwebtoken.sign(
        {
          id: await Model.publicUserSignup(),
          type: 'PUBLIC',
          locale: locale || 'en'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async authenticatePublicUser(_, { id, locale }) {

      if (await Model.publicUserLogin(id)) {
          return jsonwebtoken.sign(
            {
              id: id,
              type: 'PUBLIC',
              locale: locale || 'en'
            },
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

      Mailer.newUser(
        email,
        await Model.businessUserSignup(email, password)
      );
    },

    async verifyBusinessUser(_, { email, token }) {

      return jsonwebtoken.sign(
        {
          id: await Model.businessUserVerify(email, token),
          type: 'BUSINESS'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async authenticateBusinessUser(_, { email, password }) {

      return jsonwebtoken.sign(
        {
          id: await Model.businessUserLogin(email, password),
          type: 'BUSINESS'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },

    async changeBusinessUserPassword(_, { oldPassword, newPassword }, { user }) {
      _validateAuthenticatedBusinessUser(user);

      await Model.businessUserChangePassword(user.id, oldPassword, newPassword);
    },

    async requestBusinessUserPasswordReset(_, { email }) {

      var token = await Model.businessUserRequestResetPassword(email);

      if (token) Mailer.resetPassword(email, token);
    },

    async resetBusinessUserPassword(_, { email, token, newPassword }) {
      // return json web token
      return jsonwebtoken.sign(
        {
          id: await Model.businessUserResetPassword(email, token, newPassword),
          type: 'BUSINESS'
        },
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
          console.error(e);
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
      data.sub_type = 'STATIONERY';

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

    async deleteBusiness(_, { id }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateBusinessOwner(user, id);

      await Model.deleteBusiness(id);
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

    async deleteEvent(_, { id }, { user }) {
      _validateAuthenticatedBusinessUser(user);
      await _validateEventOwner(user, id);

      await Model.deleteEvent(id);
    },

    // admin mutations

    async authenticateAdmin(_, { key }) {

      if (key == process.env.ADMIN_KEY) {
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

      const business = await Model.businessLoader.load(id);
      const owner = await Model.businessUserLoader.load(business.owner);

      var reviewed = false;

      if (business.status == 'TENTATIVE' || business.status == 'REJECTED') {
        await Model.setBusinessApproveStatus(id, approve);

        Mailer.businessAdd(
          owner.email,
          business.display_name,
          approve
        );

        reviewed = true;
      }

      if (await Model.setBusinessUpdateApproveStatusIfExists(id, approve)) {
        Mailer.businessUpdate(
          owner.email,
          business.display_name,
          approve
        );

        reviewed = true;
      }

      if (! reviewed) {
        throw new ApolloError(
          "Business already approved",
          'DUPLICATE_BUSINESS_APPROVE'
        );
      }
    },

    async reviewEvent(_, { id, approve }, { user }) {
      _validateAuthenticatedAdmin(user);

      const event = await Model.eventLoader.load(id);
      const owner = await Model.businessUserLoader.load(event.owner)

      if (event.status == 'TENTATIVE' || event.status == 'REJECTED') {

        await Model.setEventApproveStatus(id, approve);

        Mailer.eventAdd(
          owner.email,
          event.display_name,
          approve
        );
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

      return await Model.getBusinessRating(user.id, businessId);
    },

    async owned_businesses(_, args, { user }) {
      _validateAuthenticatedBusinessUser(user);

      return await Model.getBusinessesOwnedBy(user.id);
    },

    async owned_events(_, args, { user }) {
      _validateAuthenticatedBusinessUser(user);

      return await Model.getEventsOwnedBy(user.id);
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
          return await Model.msgThreadLoader.loadMany(
            await Model.getMessageThreadIDsOwnedByBusinessUser(user.id)
          );
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
          return await Model.msgThreadLoader.loadMany(
            await Model.getMessageThreadIDsOwnedByPublicUser(user.id)
          );
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
      return await Model.getTentativeBusinesses();
    },

    async tentativeBusinessUpdates() {
      return await Model.getTentativeUpdatedBusinesses();
    },

    async tentativeNewEvents() {
      return await Model.getTentativeEvents();
    }
  },

  Business: {
    __resolveType(obj, { user }, info) {
      if (user.type == 'PUBLIC') return obj.type;
      else return obj.type + '_noLocale';
    },

    async update(parent, args, { user }) {
      _validateAuthenticatedBusinessUserOrAdmin(user);

      return await Model.getBusinessUpdate(parent.id);
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
