require('dotenv').config()
var express = require('express');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const jwt = require('express-jwt')
var cookie = require('cookie');
var fs = require('fs')
var path = require('path')

const ServerManager = require('./server_manager');

const typeDefs = gql(fs.readFileSync(path.join(__dirname, "api/schema.graphql"), "utf-8"));
const resolvers = require('./api/resolvers');

// authentication middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
});

console.info("Creating Apollo server");

const apiServer = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    inheritResolversFromInterfaces: true
  }),
  context: (integrationCtx) => ({
    user: integrationCtx.req.user
  }),
  plugins: [
    {
      serverWillStart() {
        ServerManager.begin();

        return {
          serverWillStop() {
            return ServerManager.end();
          }
        }
      }
    }
  ],
  stopOnTerminationSignals: false,
  debug: false
});

const app = express();

app.use(function(req, res, next){
  if (ServerManager.inMaintenance) ServerManager.deferRequest(next);
  else next();
});

app.use('/api', auth, function (err, req, res, next) {
  if (err) return next();
  return next(err);
});
apiServer.applyMiddleware({ app, path: '/api' });

const webui_dir = path.join(__dirname, '..', 'webui');

app.use('/', express.static(webui_dir));

app.get('/', (req, res) => {
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

  res.sendFile(path.join(webui_dir, 'html', locale, 'index.html'));
});

app.get('/*.html', (req, res) => {

  var cookies = cookie.parse(req.headers.cookie || '');

  var locale;
  if (cookies.locale !== undefined) {
    locale = cookies.locale;
  }
  else {
    res.setHeader('Set-Cookie', cookie.serialize('locale', 'en', {
      sameSite: 'strict'
    }));

    locale = "en";
  }

  res.sendFile(path.join(webui_dir, 'html', locale, req.url));
});

app.use('/attachment', express.static(
  process.env.ATTACHMENTS_DIR,
  { dotfiles:'allow' }
));

app.use('/admin', express.static(path.join(webui_dir, 'admin.html')));

app.get('/verifyuser', async (req, res) => {
  const email = req.query.email;
  const token = req.query.token;

  if (email !== undefined && token !== undefined) {
    try {
      const tokenCookie = await resolvers.Mutation.verifyBusinessUser(
        null,
        { email: email, token: token },
      );

      res.setHeader('Set-Cookie', cookie.serialize('token', tokenCookie, {
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict'
      }));
    }
    catch(e) { }  // ignore
  }

  // Redirect back after setting cookie
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
});

app.use('/privacy', express.static(path.join(webui_dir, 'privacy_policy.html')))

module.exports = { app, apiServer }
