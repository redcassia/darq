const DataLoader = require('dataloader');
var fs = require('fs')
var path = require('path')
var cookie = require('cookie');
var minify = require('html-minifier').minify;
var UglifyJS = require("uglify-js");

class WebUI {

  static _minifyHtml(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject();
        }
        else {
          const min = minify(data.toString(), {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            useShortDoctype: true
          });

          resolve(min);
        }
      });
    });
  }

  static _minifyJs(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject();
        }
        else {
          const min = UglifyJS.minify(data.toString());

          if (min.error) reject(min.error);
          else resolve(min.code);
        }
      });
    });
  }

  static _minifyCss(path) {
    return this._minifyJs(path);
  }

  static _getFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) reject();
        else resolve(data);
      });
    });
  }

  constructor(dir) {
    this.dir = dir;

    this.minify = process.env.NODE_ENV == "prod";

    this.loader = new DataLoader(
      async (keys) => {
        return keys.map(async (k) => {
          var v;
          try {
            const ext = path.extname(k);
            const p = path.join(this.dir, k);

            switch (ext) {
            case ".html":
              v = {
                type: 'text/html',
                data: this.minify
                  ? await WebUI._minifyHtml(p)
                  : await WebUI._getFile(p)
              };

              break;

            case ".js":
              v = {
                type: 'JavaScript',
                data: this.minify
                  ? await WebUI._minifyJs(p)
                  : await WebUI._getFile(p)
              }

              break;

            case ".css":
              v = {
                type: 'text/css',
                data: await WebUI._getFile(p)
              }

              break;

            case ".png":
              v = {
                type: 'image/png',
                data: await WebUI._getFile(p)
              }

              break;

            case ".ico":
              v = {
                type: 'image/vnd.microsoft.icon',
                data: await WebUI._getFile(p)
              }

              break;

            default:
              v = null;
              break;
            }
          }
          catch (e) {
            v = null;
          }

          return v;
        });
      }
    )
  }

  getOrSetLocale(req, res) {
    var cookies = cookie.parse(req.headers.cookie || '');

    var locale;
    if (cookies.locale !== undefined) {
      locale = cookies.locale;
    }
    else {
      res.setHeader('Set-Cookie', cookie.serialize('locale', 'en', {
        maxAge: 60 * 60 * 24 * 1000, // 1000 days
        sameSite: 'strict'
      }));

      locale = "en";
    }

    return locale;
  }

  async handleRequest(req, res, next) {
    var resource = await this.loader.load(req.url);

    if (resource == null) {
      next();
    }
    else {
      res.type(resource.type).send(resource.data).end();
    }
  }
}

module.exports = { WebUI }