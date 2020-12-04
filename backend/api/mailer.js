require('dotenv').config();
const nodemailer = require("nodemailer");

const sender = `"DarQ" <noreply@${process.env.DOMAIN}>`

class Mailer {
  static async _sendMail(email, subject, message) {

    // const mailTransporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: 'rosalinda.donnelly@ethereal.email',
    //     pass: 'U1nHK746UPKsUhWwsH'
    //   },
    // });

    const mailTransporter = nodemailer.createTransport({
      host: "localhost",
      port: 25,
      tls: {
        rejectUnauthorized: false
      },
    });

    mailTransporter.sendMail({
      from: sender,
      to: email,
      subject: subject,
      text: message
    });
  }

  static newUser(email, token) {

    this._sendMail(
      email,
      "Welcome to DarQ",
      `Welcome to DarQ!\n\n` +
      `Please use the following link to activate your account.\n` +
      `${process.env.VERIFY_USER_URL}?email=${email}&token=${token} \n\n` +
      `You are a few steps away from reaching our platform users.\n` +
      `We appreciate your choice and your trust in us!\n` +
      `From all of us at DarQ, we would like to deeply thank you.`
    );
  }

  static resetPassword(email, token) {

    this._sendMail(
      email,
      "DarQ Password Reset",
      `Please use the following link to reset your account password.\n` +
      `${process.env.RESET_PASSWORD_URL}&email=${email}&token=${token}\n`
    );
  }

  static businessAdd(email, business, approve) {

    if (approve) {
      this._sendMail(
        email,
        "Your Business on DarQ Has Been Approved",
        `Congratulations! Your business ${business} has been approved.\n\n` +
        `Your business will be listed on our platform within 24 hours.\n\n`+
        `Welcome to DarQ!`
      );
    }
    else {
      this._sendMail(
        email,
        "Your Business on DarQ Has Been Rejected",
        `The data for your business ${business} have been temporarily rejected.\n\n` +
        `Please contact DarQ administrators to provide any additional documentation or amend your data.\n\n`+
        `As always, we appreciate your choice and your trust in DarQ.\n\n` +
        `Business review is a thorough and delicate process that ensures the ` +
        `information presented to our users is complete and valid.\n\n` +
        `We are deeply sorry for the inconvenience and we appreciate your patience.`
      );
    }
  }

  static businessUpdate(email, business, approve) {

    if (approve) {
      this._sendMail(
        email,
        "Updated Business on DarQ Has Been Approved",
        `The updated for your business ${business} have been approved.\n\n`
      );
    }
    else {
      this._sendMail(
        email,
        "Updated Business on DarQ Has Been Rejected",
        `The updated data for your business ${business} have been temporarily rejected.\n\n` +
        `Please contact DarQ administrators to provide any additional documentation or amend your data.\n\n`+
        `As always, we appreciate your choice and your trust in DarQ.\n\n` +
        `Business review is a thorough and delicate process that ensures the ` +
        `information presented to our users is complete and valid.\n\n` +
        `We are deeply sorry for the inconvenience and we appreciate your patience.`
      );
    }
  }

  static eventAdd(email, event, approve) {

    if (approve) {
      this._sendMail(
        email,
        "Your Event on DarQ Has Been Approved",
        `Congratulations! Your event ${event} has been approved.\n\n` +
        `Your event will be listed on our platform within 24 hours.`
      );
    }
    else {
      this._sendMail(
        email,
        "Your Event on DarQ Has Been Rejected",
        `Your event ${event} has been temporarily rejected.\n\n` +
        `Please contact DarQ administrators to provide any additional documentation or amend your data.\n\n`+
        `As always, we appreciate your choice and your trust in DarQ.\n\n` +
        `Event review is a thorough and delicate process that ensures the ` +
        `information presented to our users is complete and valid.\n\n` +
        `We are deeply sorry for the inconvenience and we appreciate your patience.`
      );
    }
  }
}

module.exports = Mailer;
