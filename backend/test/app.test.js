require('dotenv').config()
const { app, apiServer } = require('../app')
var http = require('http')

var port;
var server;

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        port: port,
        path: path,
        timeout: 100
      }, (res) => {
        res.setEncoding('utf8');
        res.on('data', () => { });

        res.on('end', () => {
          resolve({
            code: res.statusCode,
            type: res.headers['content-type'],
            end: true
          });
        });
        res.on('timeout', () => {
          resolve({
            code: res.statusCode,
            type: res.headers['content-type'],
            end: false
          });
        });
        res.on('close', () => {
          resolve({
            code: res.statusCode,
            type: res.headers['content-type'],
            end: false
          });
        });
      }
    ).on('error', (e) => {
      reject(e);
    });
  });
}

beforeAll(() => {
  return new Promise((resolve, reject) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

/////

afterAll(() => {
  server.close();
});

/////

const content = {
  "text/html; charset=utf-8": [
    "/",
    "/admin",
    "/privacy",
    "/admin_business.html",
    "/admin_event.html",
    "/admin.html",
    "/beauty_form.html",
    "/business.html",
    "/child_education_form.html",
    "/cleaning_maintenance_form.html",
    "/club_form.html",
    "/cuisine_form.html",
    "/domestic_help_form.html",
    "/entertainment_form.html",
    "/event_form.html",
    "/event.html",
    "/gym_form.html",
    "/hospitality_form.html",
    "/index.html",
    "/made_in_qatar_form.html",
    "/messages.html",
    "/self_employed_form.html",
    "/settings.html",
    "/stationery_form.html",
    "/transportation_form.html",
    "/welcome.html",
  ],
  "text/javascript; charset=utf-8": [
    "/admin_business.js",
    "/admin_event.js",
    "/admin.js",
    "/beauty_form.js",
    "/beauty_form_update.js",
    "/business.js",
    "/child_education_form.js",
    "/child_education_form_update.js",
    "/cleaning_maintenance_form.js",
    "/cleaning_maintenance_form_update.js",
    "/club_form.js",
    "/club_form_update.js",
    "/cookie_manager.js",
    "/cuisine_form.js",
    "/cuisine_form_update.js",
    "/domestic_help_form.js",
    "/domestic_help_form_update.js",
    "/dynamic_loader.js",
    "/entertainment_form.js",
    "/entertainment_form_update.js",
    "/event_form.js",
    "/event_form_update.js",
    "/event.js",
    "/form.js",
    "/graphql.js",
    "/gym_form.js",
    "/gym_form_update.js",
    "/hospitality_form.js",
    "/hospitality_form_update.js",
    "/index.js",
    "/made_in_qatar_form.js",
    "/made_in_qatar_form_update.js",
    "/messages.js",
    "/profile_view.js",
    "/self_employed_form.js",
    "/self_employed_form_update.js",
    "/settings.js",
    "/shared_constants.js",
    "/stationery_form.js",
    "/stationery_form_update.js",
    "/transportation_form.js",
    "/transportation_form_update.js",
    "/util.js",
  ],
  "text/css; charset=utf-8": [
    "/index.css",
    "/style.css"
  ],
  "image/png": [
    "/assets/arrow-down-icon.png",
    "/assets/arrow-up-icon.png",
    "/assets/briefcase-icon-dark.png",
    "/assets/briefcase-icon.png",
    "/assets/calendar-icon-dark.png",
    "/assets/calendar-icon.png",
    "/assets/card-icon-dark.png",
    "/assets/card-icon.png",
    "/assets/cross-icon.png",
    "/assets/gear-icon-dark.png",
    "/assets/gear-icon.png",
    "/assets/hamburger-icon.png",
    "/assets/home-bottom-bg-1.png",
    "/assets/home-bottom-bg-2.png",
    "/assets/logo.png",
    "/assets/logo-text.png",
    "/assets/logout-icon.png",
    "/assets/msg-icon-dark.png",
    "/assets/msg-icon.png",
    "/assets/picture-icon.png",
    "/assets/saly.png",
    "/assets/user-icon-dark.png",
    "/assets/user-icon.png",
  ],
  "image/vnd.microsoft.icon": [
    "/favicon.ico"
  ]
}

for (const type in content) {
  for (const p of content[type]) {
    test(`GET ${p}`, async () => {
      var res = await get(p);
    
      expect(res.code).toBe(200);
      expect(res.type).toBe(type)
      expect(res.end).toBeTruthy();
    });
  }
}

/////

test(`GET /foo/bar`, async () => {
  var res = await get("/foo/bar");

  expect(res.code).toBe(404);
  expect(res.end).toBeTruthy();
});
