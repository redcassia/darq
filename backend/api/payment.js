require('dotenv').config();

class Payment {

  static async execute(options) {
    if (process.env.NODE_ENV != "prod") {
      return {
        provider: "dummy_provider",
        id: "dummy_provider_id"
      };
    }

    // TODO: implement
  }

  static async rollback(payment) {
    if (process.env.NODE_ENV != "prod") {
      return;
    }

    // TODO: implement
  }
}

module.exports = Payment;
