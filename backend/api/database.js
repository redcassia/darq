var mysql = require('mysql');

class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool(this.config);
  }

  query(sql, args) {
    var options;

    if (typeof sql === "object") {
      if (args !== undefined) {
        throw new TypeError("Args cannot be defined when using an options object");
      }

      options = sql;
    }
    else {
      options = {
        sql: sql,
        args: args,
        release: true
      };
    }

    return new Promise(async (resolve, reject) => {
      try {
        if (! options.conn) {
          options.conn = await this.getConnection();
        }

        options.conn.query(options.sql, options.args, (err, rows) => {
          if (options.release) options.conn.release();

          if (err) reject(err);
          else resolve(rows);
        });
      }
      catch (e) {
        reject(e);
      }
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error("Error getting a MySQL connection from pool. ", err);
          reject(err);
        }
        else {
          resolve(connection);
        }
      });
    });
  }

  beginTransaction(connection) {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  commit(connection) {
    return new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  rollback(connection) {
    return new Promise((resolve, reject) => {
      connection.rollback(() => {
        resolve();
      });
    });
  }

  close() {
    this.pool.end();
  }
}

module.exports = Database;
