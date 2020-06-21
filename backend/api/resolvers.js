var mysql = require('mysql');

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
  host: "localhost",
  user: "noah",
  password: "noah",
  database: "darq"
});

exports.root = { 
  businessUserExists: args => {
    return db.query(
      "SELECT email FROM business_user WHERE email=?",
      args.email
    ).then(rows => rows.length != 0)
  }
}
