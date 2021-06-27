require('dotenv').config();
const { Readable } = require('stream');
var fs = require('fs');
var path = require('path');

const Model = require('../api/model');

class TestData {

  static async addBusinessUsers() {
    this.businessUsers.a.token = await Model.addBusinessUser(
      this.businessUsers.a.email,
      this.businessUsers.a.password
    );

    this.businessUsers.b.token = await Model.addBusinessUser(
      this.businessUsers.b.email,
      this.businessUsers.b.password
    );
  }

  static async setBusinessUsersVerified() {
    await Model.setBusinessUserVerified(
      this.businessUsers.a.email,
      this.businessUsers.a.token
    );

    await Model.setBusinessUserVerified(
      this.businessUsers.b.email,
      this.businessUsers.b.token
    );
  }

  static async verifyBusinessUsers() {
    this.businessUsers.a.id = await Model.verifyBusinessUser(
      this.businessUsers.a.email,
      this.businessUsers.a.password
    );

    this.businessUsers.b.id = await Model.verifyBusinessUser(
      this.businessUsers.b.email,
      this.businessUsers.b.password
    );
  }

  static _makeUpload(name) {
    return {
      createReadStream: () => Readable.from(this.attachments[name]),
      filename: name + ".test",
      mimetype: null,
      encoding: null
    }
  }
  
  static _putUploads(data) {
    for (var key in data) {
      switch (key) {
      case "display_picture":
      case "picture":
      case "government_id":
      case "trade_license":
        data[key] = this._makeUpload(data[key])

        break;

      case "attachments":
      case "menu":
        for (var i = 0; i < data[key].length; ++i) {
          data[key][i] = this._makeUpload(data[key][i])
        }

        break;

      case "personnel":
        for (var i = 0; i < data[key].length; ++i) {
          data[key][i] = this._putUploads(data[key][i]);
        }

        break;

      default: break;
      }
    }

    return data;
  }


  static async addBusinesses() {
    for (var user in this.businesses) {
      for (var bName in this.businesses[user]) {
        var copy = JSON.parse(JSON.stringify(this.businesses[user][bName]));
        copy = this._putUploads(copy);
        this.businesses[user][bName].id = await Model.addBusiness(
          copy,
          this.businessUsers[user].id
        );
      }
    }
  }

  static async removeData() {
    await Model.__purge();

    fs.readdirSync(path.join(process.env.ATTACHMENTS_DIR))
      .forEach((f) => {
        if (f.endsWith(".test")) {
          fs.unlinkSync(path.join(process.env.ATTACHMENTS_DIR, f));
        }
      });

    fs.readdirSync(path.join(process.env.ATTACHMENTS_DIR, 'thumb'))
      .forEach((f) => {
        if (f.endsWith(".test")) {
          fs.unlinkSync(path.join(process.env.ATTACHMENTS_DIR, 'thumb', f));
        }
      });
  }

  static validate(received, expected) {
    for (var key in expected) {
      switch (key) {
      case "display_picture":
      case "picture":
      case "government_id":
      case "trade_license":
        expect(received[key]).toBeDefined();

        expect(
          fs.readFileSync(
            path.join(process.env.ATTACHMENTS_DIR, received[key])
          ).toString()
        ).toBe(
          this.attachments[expected[key]]
        );

        break;

      case "attachments":
      case "menu":
        for (var i = 0; i < expected[key].length; ++i) {
          expect(received[key][i]).toBeDefined();

          expect(
            fs.readFileSync(
              path.join(process.env.ATTACHMENTS_DIR, received[key][i])
            ).toString()
          ).toBe(
            this.attachments[expected[key][i]]
          );
        }

        break;

      case "personnel":
        for (var i = 0; i < expected[key].length; ++i) {
          expect(received[key][i]).toBeDefined();

          this.validate(received[key][i], expected[key][i]);
        }

        break;

      default:
        expect(received[key]).toStrictEqual(expected[key]);
      }
    }
  }
}

TestData.businessUsers = {
  a: {
    email: "a@example.com",
    password: "a's password",
  },
  b: {
    email: "b@example.com",
    password: "b's password",
  }
}

TestData.attachments = {
  attach1: "attachment 1",
  attach2: "attachment 2",
  attach3: "attachment 3",
}

TestData.businesses = {
  a: [
    {
      type: 'SelfEmployedBusiness',
      display_name: "a_self_employed",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'SOCIAL_MEDIA_SPECIALIST',
      gender: 'FEMALE',
      nationality: 'QATARI',
      phone_number: [ "123", "456" ],
      description: {
        en: "A's Self Employed Business",
        ar: "Something in Arabic, I guess",
      },
      skills: [
        {
          en: "Time Management",
          ar: "Time Management"
        },
        {
          en: "communication",
          ar: "communication"
        }
      ],
      experience: [
        {
          country: 'QATAR',
          institution: 'An institution',
          from: '1990-01-01',
          to: '1997-12-31',
          in_position: false
        },
        {
          country: 'QATAR',
          institution: 'Another institution',
          from: '1998-01-01',
          to: null,
          in_position: true
        }
      ],
      charge: {
        value: 999.57,
        currency: 'QAR'
      },
      government_id: "attach2",
      attachments: [
        "attach3",
        "attach1",
        "attach2",
      ],
    },
    {
      type: 'ChildEducationBusiness',
      display_name: "a_child_education",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'SKILLS_DEVELOPMENT_CENTER',
      trade_license: "attach2",
      trade_license_number: "123456789",
      street_address: "123 Fake st",
      phone_number: [ "999993243", "3762473" ],
      description: {
        en: "A's child education business",
        ar: "Another thing in Arabic, I guess",
      },
      year_founded: "1960",
      curriculum: [
        {
          en: "something",
          ar: "something else"
        },
        {
          en: "another thing",
          ar: "yet another thing"
        }
      ],
      attachments: [
        "attach1",
        "attach3",
        "attach2",
        "attach1",
      ],
    },
    {
      type: 'DomesticHelpBusiness',
      display_name: "a_domestic_help",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'OTHER',
      trade_license: "attach1",
      trade_license_number: "123454326789",
      street_address: "456 Definitely Not A Fake st",
      phone_number: [ "99999473" ],
      description: {
        en: "A's domestic help business",
        ar: "-_-",
      },
      website: "www.we-got-your-slaves.qa",
      personnel: [
        {
          name: "Someone",
          picture: "attach1",
          profession: "Nanny",
          gender: 'MALE',
          nationality: 'AUSTRIAN',
          religion: "this is definitely not discrimination!!",
          salary: {
            value: 0.69,
            currency: 'QAR'
          },
          date_of_birth: "1990-01-01",
          marital_status: 'DIVORCED',
          languages: [
            {
              en: "Speaks anything",
              ar: "No hablos Arabic"
            },
          ],
          experience: [
            {
              country: 'AUSTRIA',
              institution: "Over there",
              from: "1992-03-04",
              to: "1992-03-05",
              in_position: false
            },
            {
              country: 'QATAR',
              institution: "Here",
              from: "2001-03-04",
              in_position: true
            }
          ],
          phone_number: "3455",
          attachments: [
            "attach3"
          ],
          education: '',
          height: "10 ft",
          weight: "250 kg",
          skills: [
            {
              en: "being a giant",
              ar: "reaching that top shelf"
            }
          ],
          number_of_children: 500
        },
        {
          name: "Someone Else",
          picture: "attach2",
          profession: "Driver",
          gender: 'MALE',
          nationality: 'AUSTRIAN',
          religion: "this is definitely not discrimination!!",
          salary: {
            value: 0.69,
            currency: 'QAR'
          },
          date_of_birth: "1990-01-01",
          marital_status: 'DIVORCED',
          languages: [
            {
              en: "Speaks anything",
              ar: "No hablos Arabic"
            },
          ],
          experience: [
            {
              country: 'AUSTRIA',
              institution: "Over there",
              from: "1992-03-04",
              to: "1992-03-05",
              in_position: false
            },
            {
              country: 'QATAR',
              institution: "Here",
              from: "2001-03-04",
              in_position: true
            }
          ],
          phone_number: "3455",
          attachments: [
            "attach3"
          ],
          license_expiry_date: "1993-05-05"
        }
      ],
    },
  ],
}

module.exports = TestData;
