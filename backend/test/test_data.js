require('dotenv').config();
const { Readable } = require('stream');
var fs = require('fs');
var path = require('path');

const Model = require('../api/model');

class TestData {

  static _makeAttachment(name) {
    return {
      createReadStream: () => Readable.from(this.attachments[name]),
      filename: name + ".test",
      mimetype: null,
      encoding: null
    }
  }

  static _putAttachments(data) {
    for (var key in data) {
      switch (key) {
      case "display_picture":
      case "picture":
      case "government_id":
      case "trade_license":
        data[key] = this._makeAttachment(data[key])

        break;

      case "attachments":
      case "menu":
        for (var i = 0; i < data[key].length; ++i) {
          data[key][i] = this._makeAttachment(data[key][i])
        }

        break;

      case "personnel":
        for (var i = 0; i < data[key].length; ++i) {
          data[key][i] = this._putAttachments(data[key][i]);
        }

        break;

      default: break;
      }
    }

    return data;
  }

  static attachmentsOf(data) {
    var res = [];

    for (var key in data) {
      switch (key) {
      case "display_picture":
      case "picture":
      case "government_id":
      case "trade_license":
        res.push(data[key]);

        break;

      case "attachments":
      case "menu":
        for (var i = 0; i < data[key].length; ++i) {
          res.push(data[key][i]);
        }

        break;

      case "personnel":
        for (var i = 0; i < data[key].length; ++i) {
          res = res.concat(this.attachmentsOf(data[key][i]));
        }

        break;

      default: break;
      }
    }

    return res;
  }

  static attachmentExists(attachment) {
    return fs.existsSync(path.join(process.env.ATTACHMENTS_DIR, attachment));
  }

  static attachmentThumbnailExists(attachment) {
    return fs.existsSync(path.join(process.env.ATTACHMENTS_DIR, 'thumb', attachment));
  }

  static async addBusinesses() {
    for (var user in this.businesses) {
      for (var i in this.businesses[user]) {
        var copy = JSON.parse(JSON.stringify(this.businesses[user][i]));
        copy = this._putAttachments(copy);
        this.businesses[user][i].id = await Model.addBusiness(
          copy,
          this.businessUsers[user].id
        );
      }
    }
  }

  static async updateBusinesses() {
    for (var user in this.businesses) {
      for (var i in this.businesses[user]) {
        if (! this.businessUpdates[user][i]) continue;

        var copy = JSON.parse(JSON.stringify(this.businessUpdates[user][i]));
        if (copy["personnel"]) delete copy["personnel"];
        if (copy["old_personnel"]) delete copy["old_personnel"];
        copy = this._putAttachments(copy);

        await Model.updateBusiness(
          this.businesses[user][i].id,
          copy
        );
      }
    }
  }

  static async updatePersonnelOfDomesticHelpBusinesses() {
    for (var user in this.businesses) {
      for (var i in this.businesses[user]) {
        if (! this.businessUpdates[user][i]) continue;

        if (this.businesses[user][i].type != 'DomesticHelpBusiness') continue;
        if (
          ! this.businessUpdates[user][i].old_personnel
          && ! this.businessUpdates[user][i].personnel
        ) continue;

        var copy = JSON.parse(JSON.stringify(this.businessUpdates[user][i]));
        copy = this._putAttachments(copy);

        await Model.updateDomesticHelpPersonnel(
          this.businesses[user][i].id,
          copy
        );
      }
    }
  }

  static async addEvents() {
    for (var user in this.events) {
      for (var i in this.events[user]) {
        var copy = JSON.parse(JSON.stringify(this.events[user][i]));
        copy = this._putAttachments(copy);
        this.events[user][i].id = await Model.addEvent(
          copy,
          this.businessUsers[user].id
        );
      }
    }
  }

  static async updateEvents() {
    for (var user in this.events) {
      for (var i in this.events[user]) {
        if (! this.eventUpdates[user][i]) continue;

        var copy = JSON.parse(JSON.stringify(this.eventUpdates[user][i]));
        copy = this._putAttachments(copy);
        await Model.updateEvent(
          this.events[user][i].id,
          copy
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

  static validate(received, expected, skipPersonnel = false) {
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
        if (! skipPersonnel) {
          for (var i = 0; i < expected[key].length; ++i) {
            var j = received[key].findIndex(_ => _["name"] == expected[key][i]["name"]);

            expect(j).not.toBe(-1);

            expect(received[key][j]).toBeDefined();

            this.validate(received[key][j], expected[key][i], skipPersonnel);
          }
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
    new_password: "a's other password",
    reset_password: "a's yet another password",
  },
  b: {
    email: "b@example.com",
    password: "b's password",
    new_password: "b's other password",
    reset_password: "b's yet another password",
  }
};

TestData.attachments = {
  attach1: "attachment 1",
  attach2: "attachment 2",
  attach3: "attachment 3",
};

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
      sub_type_string: "Dumbest thing ever",
      trade_license: "attach1",
      trade_license_number: "123454326789",
      street_address: "456 Definitely Not A Fake st",
      phone_number: [ "99999473" ],
      description: {
        en: "A's domestic help business",
        ar: "-_-",
      },
      website: "www.this-is-dumb.qa",
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
    {
      type: 'BeautyBusiness',
      display_name: "You Look Nice!",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "I feel pretty",
      trade_license: "attach2",
      trade_license_number: "1234",
      street_address: "789 Lovely St",
      operating_hours: {
        all_day: true
      },
      phone_number: [ "123456" ],
      description: {
        en: "We'll make you look nice",
        ar: "We'll make you look nice"
      },
      home_service_available: true,
      services: [ "hair", "makeup", "nails" ],
      website: "www.i-feel-pretty.com",
      attachments: [
        "attach2",
        "attach1"
      ],
    },
    {
      type: 'TransportationBusiness',
      display_name: "We get you there",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Chauffeur",
      trade_license: "attach2",
      trade_license_number: "12345",
      street_address: "123 A St",
      operating_hours: {
        open: "12:00",
        close: "14:00",
        all_day: false
      },
      phone_number: [ "12344" ],
      description: {
        en: "something",
        ar: "another thing",
      },
      services: [ "driving", "vroom vroom" ],
      website: "www.vroom-vroom.com",
      attachments: [
        "attach1",
        "attach2",
      ],
    },
    {
      type: 'HospitalityBusiness',
      display_name: "Mi casa, su casa",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Catering",
      trade_license: "attach3",
      trade_license_number: "12345",
      street_address: "123 Su casa",
      phone_number: [ "88888888888" ],
      description: {
        en: "food and whatnot",
        ar: "same..."
      },
      home_service_available: false,
      charge: {
        value: "67657",
        currency: 'QAR'
      },
      services: [ "food", "whatnot" ],
      website:"www.mi-casa-su-casa.com",
      attachments: [
        "attach2"
      ],
    },
  ],
  b: [
    {
      type: 'StationeryBusiness',
      display_name: "b_stationery",
      display_picture: "attach2",
      sub_type: 'STATIONERY',
      city: 'DOHA',
      description: {
        en: "pens and notebooks and stuff",
        ar: "pens and notebooks and stuff",
      },
      trade_license: "attach3",
      trade_license_number: "12345",
      street_address: "123 Fake St",
      phone_number: [ "1234" ],
      website: "www.stationery.qa",
      attachments: [
        "attach1",
        "attach2",
      ],
    },
    {
      type: 'MadeInQatarBusiness',
      display_name: "Proud Qatari",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Dairy shop",
      street_address: "1 Milky way",
      phone_number: [ "43764876" ],
      description: {
        en: "We have the best yogurt",
        ar: "We have the best yogurt",
      },
      home_delivery_available: true,
      products: [
        {
          en: "milk",
          ar: "milk",
        },
        {
          en: "Froyo",
          ar: "Froyo",
        },
      ],
    },
    {
      type: 'SportsBusiness',
      display_name: "Sporty",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'GYM',
      trade_license: "attach2",
      trade_license_number: "13",
      street_address: "123 Over there",
      operating_hours: {
        open: "06:00",
        close: "23:00",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "A very good gym",
        ar: "A very good gym",
      },
      home_training_available: true,
      classes: [
        {
          en: "Class A",
          ar: "Class A",
        },
        {
          en: "Class B",
          ar: "Class B",
        }
      ],
      genders: 'MIXED',
    },
    {
      type: 'EntertainmentBusiness',
      display_name: "Mall Park",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'SHOPPING_MALL',
      trade_license: "attach3",
      trade_license_number: "1234",
      street_address: "123 Mall St",
      operating_hours: {
        all_day: true
      },
      phone_number: [ "1234", "456", "7890" ],
      description: {
        en: "Hola!",
        ar: "Hola!",
      },
      activities: [
        {
          en: "Shopping",
          ar: "Shopping",
        },
        {
          en: "More Shopping",
          ar: "More Shopping",
        },
      ],
    },
    {
      type: 'FoodBusiness',
      display_name: "Delish",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'AMERICAN_RESTAURANT',
      trade_license: "attach2",
      trade_license_number: "12345",
      street_address: "123 Fake St",
      operating_hours: {
        open: "09:00",
        close: "22:00",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "It's very good",
        ar: "It's very good",
      },
      website: "www.food.qa",
      menu: [
        "attach3",
        "attach2",
        "attach1"
      ],
    },
    {
      type: 'CleaningAndMaintenanceBusiness',
      display_name: "Squeaky clean",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Squeaky",
      trade_license: "attach1",
      trade_license_number: "1234546",
      street_address: "24334 X St",
      operating_hours: {
        open: "10:00",
        close: "13:33",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "Squeaky",
        ar: "clean",
      },
      home_service_available: false,
      charge: {
        value: 200,
        currency: 'QAR',
      },
    },
  ]
};

TestData.businessUpdates = {
  a: [
    {       // type: 'SelfEmployedBusiness',
      display_picture: "attach2",
      gender: 'MALE',
      phone_number: [ "123", "456", "789" ],
      description: {
        en: "A's Self Employed Businessss",
        ar: "Something in Arabic, I guess",
      },
      skills: [
        {
          en: "Time Management",
          ar: "Time Mangement"
        },
        {
          en: "communication",
          ar: "communication"
        }
      ],
      charge: {
        value: 833.50,
        currency: 'QAR'
      },
      old_attachments: [ ],
      attachments: [
        "attach1",
      ],
    },
    {       // type: 'ChildEducationBusiness'
    },
    {       // type: 'DomesticHelpBusiness'
      description: {
        en: "A's domestic help business",
        ar: "A slightly different Arabic description",
      },
      old_personnel: [ "Someone" ],
      personnel: [
        {
          name: "Someone Else",
          picture: "attach1",
          salary: {
            value: 0.77,
            currency: 'USD'
          },
          phone_number: "345567",
          old_attachments: [ ],
          attachments: [
            "attach2"
          ],
          license_expiry_date: "1993-05-17"
        }
      ],
    },
    {       // type: 'BeautyBusiness'
      home_service_available: false,
      services: [ "hair", "makeup" ],
    },
    {       // type: 'TransportationBusiness'
      display_name: "We get you over there",
    },
    {       // type: 'HospitalityBusiness'
      home_service_available: true,
    },
  ],
  b: [
    {       // type: 'StationeryBusiness'
      description: {
        en: "pens and notebooks and stuff",
        ar: "pens and notebooks and stuffff",
      },
      street_address: "456 Fake St",
    },
    {       // type: 'MadeInQatarBusiness'
      display_picture: "attach3",
      home_delivery_available: false,
      products: [
        {
          en: "milk",
          ar: "milk",
        },
        {
          en: "Frozen Yogurt",
          ar: "Froyo",
        },
      ],
    },
    {       // type: 'SportsBusiness'
      display_picture: "attach2",
      attachments: [
        "attach1",
        "attach3"
      ],
    },
    {       // type: 'EntertainmentBusiness'
      website: "www.mall.qa",
    },
    {       // type: 'FoodBusiness'
      description: {
        en: "It'sa very good",
        ar: "It's very good",
      },
    },
    {       // type: 'CleaningAndMaintenanceBusiness'
      home_service_available: true,
      charge: {
        value: 201,
        currency: 'QAR',
      },
    },
  ],
}

TestData.updatedBusinesses = {
  a: [
    {
      type: 'SelfEmployedBusiness',
      display_name: "a_self_employed",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'SOCIAL_MEDIA_SPECIALIST',
      gender: 'MALE',
      nationality: 'QATARI',
      phone_number: [ "123", "456", "789" ],
      description: {
        en: "A's Self Employed Businessss",
        ar: "Something in Arabic, I guess",
      },
      skills: [
        {
          en: "Time Management",
          ar: "Time Mangement"
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
        value: 833.50,
        currency: 'QAR'
      },
      government_id: "attach2",
      attachments: [
        "attach1",
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
        ar: "A slightly different Arabic description",
      },
      website: "www.this-is-dumb.qa",
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
          picture: "attach1",
          profession: "Driver",
          gender: 'MALE',
          nationality: 'AUSTRIAN',
          religion: "this is definitely not discrimination!!",
          salary: {
            value: 0.77,
            currency: 'USD'
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
          phone_number: "345567",
          attachments: [
            "attach2"
          ],
          license_expiry_date: "1993-05-17"
        }
      ],
    },
    {
      type: 'BeautyBusiness',
      display_name: "You Look Nice!",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "I feel pretty",
      trade_license: "attach2",
      trade_license_number: "1234",
      street_address: "789 Lovely St",
      operating_hours: {
        all_day: true
      },
      phone_number: [ "123456" ],
      description: {
        en: "We'll make you look nice",
        ar: "We'll make you look nice"
      },
      home_service_available: false,
      services: [ "hair", "makeup" ],
      website: "www.i-feel-pretty.com",
      attachments: [
        "attach2",
        "attach1"
      ]
    },
    {
      type: 'TransportationBusiness',
      display_name: "We get you over there",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Chauffeur",
      trade_license: "attach2",
      trade_license_number: "12345",
      street_address: "123 A St",
      operating_hours: {
        open: "12:00",
        close: "14:00",
        all_day: false
      },
      phone_number: [ "12344" ],
      description: {
        en: "something",
        ar: "another thing",
      },
      services: [ "driving", "vroom vroom" ],
      website: "www.vroom-vroom.com",
      attachments: [
        "attach1",
        "attach2",
      ],
    },
    {
      type: 'HospitalityBusiness',
      display_name: "Mi casa, su casa",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Catering",
      trade_license: "attach3",
      trade_license_number: "12345",
      street_address: "123 Su casa",
      phone_number: [ "88888888888" ],
      description: {
        en: "food and whatnot",
        ar: "same..."
      },
      home_service_available: true,
      charge: {
        value: "67657",
        currency: 'QAR'
      },
      services: [ "food", "whatnot" ],
      website:"www.mi-casa-su-casa.com",
      attachments: [
        "attach2"
      ],
    },
  ],
  b: [
    {
      type: 'StationeryBusiness',
      display_name: "b_stationery",
      display_picture: "attach2",
      sub_type: 'STATIONERY',
      city: 'DOHA',
      description: {
        en: "pens and notebooks and stuff",
        ar: "pens and notebooks and stuffff",
      },
      trade_license: "attach3",
      trade_license_number: "12345",
      street_address: "456 Fake St",
      phone_number: [ "1234" ],
      website: "www.stationery.qa",
      attachments: [
        "attach1",
        "attach2",
      ],
    },
    {
      type: 'MadeInQatarBusiness',
      display_name: "Proud Qatari",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Dairy shop",
      street_address: "1 Milky way",
      phone_number: [ "43764876" ],
      description: {
        en: "We have the best yogurt",
        ar: "We have the best yogurt",
      },
      home_delivery_available: false,
      products: [
        {
          en: "milk",
          ar: "milk",
        },
        {
          en: "Frozen Yogurt",
          ar: "Froyo",
        },
      ],
    },
    {
      type: 'SportsBusiness',
      display_name: "Sporty",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'GYM',
      trade_license: "attach2",
      trade_license_number: "13",
      street_address: "123 Over there",
      operating_hours: {
        open: "06:00",
        close: "23:00",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "A very good gym",
        ar: "A very good gym",
      },
      home_training_available: true,
      classes: [
        {
          en: "Class A",
          ar: "Class A",
        },
        {
          en: "Class B",
          ar: "Class B",
        }
      ],
      genders: 'MIXED',
      attachments: [
        "attach1",
        "attach3"
      ],
    },
    {
      type: 'EntertainmentBusiness',
      display_name: "Mall Park",
      display_picture: "attach1",
      city: 'DOHA',
      sub_type: 'SHOPPING_MALL',
      trade_license: "attach3",
      trade_license_number: "1234",
      street_address: "123 Mall St",
      operating_hours: {
        all_day: true
      },
      phone_number: [ "1234", "456", "7890" ],
      description: {
        en: "Hola!",
        ar: "Hola!",
      },
      activities: [
        {
          en: "Shopping",
          ar: "Shopping",
        },
        {
          en: "More Shopping",
          ar: "More Shopping",
        },
      ],
      website: "www.mall.qa",
    },
    {
      type: 'FoodBusiness',
      display_name: "Delish",
      display_picture: "attach3",
      city: 'DOHA',
      sub_type: 'AMERICAN_RESTAURANT',
      trade_license: "attach2",
      trade_license_number: "12345",
      street_address: "123 Fake St",
      operating_hours: {
        open: "09:00",
        close: "22:00",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "It'sa very good",
        ar: "It's very good",
      },
      website: "www.food.qa",
      menu: [
        "attach3",
        "attach2",
        "attach1"
      ],
    },
    {
      type: 'CleaningAndMaintenanceBusiness',
      display_name: "Squeaky clean",
      display_picture: "attach2",
      city: 'DOHA',
      sub_type: 'OTHER',
      sub_type_string: "Squeaky",
      trade_license: "attach1",
      trade_license_number: "1234546",
      street_address: "24334 X St",
      operating_hours: {
        open: "10:00",
        close: "13:33",
        all_day: false
      },
      phone_number: [ "123", "456" ],
      description: {
        en: "Squeaky",
        ar: "clean",
      },
      home_service_available: true,
      charge: {
        value: 201,
        currency: 'QAR',
      },
    },
  ],
};

TestData.businessesDeletes = {
  a: [
    false,
    true,
    false,
    true,
    true,
    false,
  ],
  b: [
    true,
    false,
    false,
    true,
    true,
    true,
  ],
};

TestData.events = {
  a: [
    {
      display_name: "a_event_1",
      display_picture: "attach3",
      type: 'CONFERENCE',
      city: 'DOHA',
      street_address: "456 Over there",
      phone_number: [ "123" ],
      description: {
        en: "An event",
        ar: "An event, but in Arabic"
      },
      duration: {
        start: "1990-12-25 00:00:00",
        end: "2100-12-30 00:00:00"
      },
      hours: {
        open: "12:00",
        close: "14:00",
        all_day: false
      },
      ticket_website: "www.your-event.com",
      ticket_price: {
        valueLower: 140,
        valueUpper: 900,
        currency: 'QAR'
      },
      organizer: "A very important organizer",
      attachments: [
        "attach1",
        "attach2"
      ]
    }
  ]
};

TestData.eventUpdates = {
  a: [
    {
      display_picture: "attach2",
      phone_number: [ "123", "456" ],
      hours: {
        open: "12:00",
        close: "14:01",
        all_day: false
      }
    }
  ]
};

TestData.updatedEvents = {
  a: [
    {
      display_name: "a_event_1",
      display_picture: "attach2",
      type: 'CONFERENCE',
      city: 'DOHA',
      street_address: "456 Over there",
      phone_number: [ "123", "456" ],
      description: {
        en: "An event",
        ar: "An event, but in Arabic"
      },
      duration: {
        start: "1990-12-25 00:00:00",
        end: "2100-12-30 00:00:00"
      },
      hours: {
        open: "12:00",
        close: "14:01",
        all_day: false
      },
      ticket_website: "www.your-event.com",
      ticket_price: {
        valueLower: 140,
        valueUpper: 900,
        currency: 'QAR'
      },
      organizer: "A very important organizer",
      attachments: [
        "attach1",
        "attach2"
      ]
    }
  ]
};

TestData.eventDeletes = {
  a: [
    true
  ]
};

TestData.publicUsers = [ ];

module.exports = TestData;
