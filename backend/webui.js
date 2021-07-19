const DataLoader = require('dataloader');
var fs = require('fs')
var path = require('path')
var cookie = require('cookie');
var minify = require('html-minifier').minify;
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');

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
    const cssMin = new CleanCSS({
      level: {
        1: {
          cleanupCharsets: true, // controls `@charset` moving to the front of a stylesheet; defaults to `true`
          normalizeUrls: true, // controls URL normalization; defaults to `true`
          optimizeBackground: true, // controls `background` property optimizations; defaults to `true`
          optimizeBorderRadius: true, // controls `border-radius` property optimizations; defaults to `true`
          optimizeFilter: true, // controls `filter` property optimizations; defaults to `true`
          optimizeFont: true, // controls `font` property optimizations; defaults to `true`
          optimizeFontWeight: true, // controls `font-weight` property optimizations; defaults to `true`
          optimizeOutline: true, // controls `outline` property optimizations; defaults to `true`
          removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`
          removeNegativePaddings: true, // controls removing negative paddings; defaults to `true`
          removeQuotes: true, // controls removing quotes when unnecessary; defaults to `true`
          removeWhitespace: true, // controls removing unused whitespace; defaults to `true`
          replaceMultipleZeros: true, // contols removing redundant zeros; defaults to `true`
          replaceTimeUnits: true, // controls replacing time units with shorter values; defaults to `true`
          replaceZeroUnits: true, // controls replacing zero values with units; defaults to `true`
          roundingPrecision: false, // rounds pixel values to `N` decimal places; `false` disables rounding; defaults to `false`
          selectorsSortingMethod: 'standard', // denotes selector sorting method; can be `'natural'` or `'standard'`, `'none'`, or false (the last two since 4.1.0); defaults to `'standard'`
          specialComments: 'all', // denotes a number of /*! ... */ comments preserved; defaults to `all`
          tidyAtRules: true, // controls at-rules (e.g. `@charset`, `@import`) optimizing; defaults to `true`
          tidyBlockScopes: true, // controls block scopes (e.g. `@media`) optimizing; defaults to `true`
          tidySelectors: true, // controls selectors optimizing; defaults to `true`
        },
        2: {
          mergeAdjacentRules: true, // controls adjacent rules merging; defaults to true
          mergeIntoShorthands: true, // controls merging properties into shorthands; defaults to true
          mergeMedia: true, // controls `@media` merging; defaults to true
          mergeNonAdjacentRules: true, // controls non-adjacent rule merging; defaults to true
          mergeSemantically: false, // controls semantic merging; defaults to false
          overrideProperties: true, // controls property overriding based on understandability; defaults to true
          removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`
          reduceNonAdjacentRules: true, // controls non-adjacent rule reducing; defaults to true
          removeDuplicateFontRules: true, // controls duplicate `@font-face` removing; defaults to true
          removeDuplicateMediaBlocks: true, // controls duplicate `@media` removing; defaults to true
          removeDuplicateRules: true, // controls duplicate rules removing; defaults to true
          removeUnusedAtRules: false, // controls unused at rule removing; defaults to false (available since 4.1.0)
          restructureRules: false, // controls rule restructuring; defaults to false
          skipProperties: [] // controls which properties won't be optimized, defaults to `[]` which means all will be optimized (since 4.1.0)
        }
      }
    });

    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject();
        }
        else {
          const min = cssMin.minify(data);

          if (min.errors && min.errors.length > 0) reject(min.errors);
          else resolve(min.styles);
        }
      });
    });
  }

  static _getFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) reject();
        else resolve(data);
      });
    });
  }

  async _get(k) {
    var v = null;

    try {
      const ext = path.extname(k);
      const p = path.join(this.dir, k);

      switch (ext) {
      case ".html":
        v = {
          type: 'text/html',
          data: this.doMinify
            ? await WebUI._minifyHtml(p)
            : await WebUI._getFile(p)
        };

        break;

      case ".js":
        v = {
          type: 'text/javascript',
          data: this.doMinify
            ? await WebUI._minifyJs(p)
            : await WebUI._getFile(p)
        }

        break;

      case ".css":
        v = {
          type: 'text/css',
          data: this.doMinify
            ? await WebUI._minifyCss(p)
            : await WebUI._getFile(p)
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
          type: 'image/x-icon',
          data: await WebUI._getFile(p)
        }

        break;

      default: break;
      }
    }
    catch (ignored) { }

    return v;
  }

  constructor(dir) {
    this.dir = dir;

    this.doMinify = process.env.NODE_ENV != "dev";
    this.doCache = process.env.NODE_ENV != "dev";

    this.loader = new DataLoader(
      async (keys) => keys.map(async (k) => await this._get(k))
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
    var resource = 
      this.doCache
        ? await this.loader.load(req.url)
        : await this._get(req.url);

    if (resource == null) {
      next();
    }
    else {
      if (this.doCache) {
        res.set('Cache-Control', 'public, max-age=36000, immutable')
      }

      res.type(resource.type)
        .send(resource.data)
        .end();
    }
  }
}

module.exports = { WebUI }
