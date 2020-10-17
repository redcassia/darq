const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'rosalinda.donnelly@ethereal.email',
    pass: 'U1nHK746UPKsUhWwsH'
  },
});

class Mailer {
  static async _sendMail(email, subject, message) {
    mailTransporter.sendMail({
      from: '"DarQ" <noreply@darq.qa>',
      to: email,
      subject: subject,
      text: message
    });
  }

  static async newUser(email) {
    this._sendMail(
      email,
      "Welcome to DarQ",
      `Welcome to DarQ!\n\n` +
      `You are a few steps away from reaching our platform users.\n` +
      `We appreciate your choice and your trust in us!\n` + 
      `From all of us at DarQ, we would like to deeply thank you.`
    );
  }

  static async businessAdd(email, business, approve) {
    if (approve) {
      this._sendMail(
        email,
        "Your business on DarQ has been approved",
        `Congratulations! Your business ${business} has been approved.\n\n` +
        `Your business will be listed on our platform within 24 hours.\n\n`+
        `Welcome to DarQ!`
      );
    }
    else {
      this._sendMail(
        email,
        "Your business on DarQ has been rejected",
        `The data for your business ${business} have been temporarily rejected.\n\n` +
        `Please contact DarQ administrators to provide any additional documentation or amend your data.\n\n`+
        `As always, we appreciate your choice and your trust in DarQ.\n\n` +
        `Business review is a thorough and delicate process that ensures the ` +
        `information presented to our users is complete and valid.\n\n` +
        `We are deeply sorry for the inconvenience and we appreciate your patience.`
      );
    }
  }

  static async businessUpdate(email, business, approve) {

    if (approve) {
      this._sendMail(
        email,
        "Updated business data on DarQ have been approved",
        `The updated for your business ${business} have been approved.\n\n`
      );
    }
    else {
      this._sendMail(
        email,
        "Updated business data on DarQ have been rejected",
        `The updated data for your business ${business} have been temporarily rejected.\n\n` +
        `Please contact DarQ administrators to provide any additional documentation or amend your data.\n\n`+
        `As always, we appreciate your choice and your trust in DarQ.\n\n` +
        `Business review is a thorough and delicate process that ensures the ` +
        `information presented to our users is complete and valid.\n\n` +
        `We are deeply sorry for the inconvenience and we appreciate your patience.`
      );
    }
  }

  static async eventAdd(email, event, approve) {
    if (approve) {
      this._sendMail(
        email,
        "Your event on DarQ has been approved",
        `Congratulations! Your event ${event} has been approved.\n\n` +
        `Your event will be listed on our platform within 24 hours.`
      );
    }
    else {
      this._sendMail(
        email,
        "Your event on DarQ has been rejected",
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
