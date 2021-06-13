var mysql = require('mysql');

class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool(this.config);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function(err, connection) {
        if (err) {
          console.error("Error getting a MySQL connection from pool. ", err);
          reject(err);
        }
        else {
          connection.query(sql, args, (err, rows) => {
            connection.release();
  
            if (err) {
              reject(err);
            }
            else {
              resolve(rows);
            }
          });
        }
      });
    });
  }

  connection() {
    return this.pool.getConnection;
  }

  close() {
    this.pool.end();
  }
}

module.exports = Database;
