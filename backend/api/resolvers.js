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
        "SELECT * FROM business_user WHERE id=?",
        [ id ]
      ).then(rows => rows[0]);
    });
  }
);

const publicUserLoader = new DataLoader(
  async (ids) => {
    return ids.map((id) => {
      return db.query(
        "SELECT * FROM public_user WHERE id=?",
        [ id ]
      ).then(rows => rows[0]);
    });
  }
);

const resolvers = {
  Query: {
    async user(root, args, { user }) {
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
        throw new ApolloError("Failed to signup.", 'PUBLIC_USER_SIGNUP_REJECTED');
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
        throw new ApolloError("Failed to signup.", 'BUSINESS_USER_SIGNUP_REJECTED');
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
            "Invalid ID. Please make sure the ID is correct or signup again.",
            'PUBLIC_USER_LOGIN_REJECTED'
          );
        }
      }
      catch(e) {
        throw new ApolloError(
          "Failed to login.",
          'PUBLIC_USER_LOGIN_FAILURE'
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
          'BUSINESS_USER_LOGIN_FAILURE'
        );
      }

      console.log(await bcrypt.hash(password, 10));

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
    }
  }
}

module.exports = resolvers;
