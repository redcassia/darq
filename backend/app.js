require('dotenv').config()
var express = require('express');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const jwt = require('express-jwt')
var cookie = require('cookie');
var fs = require('fs')
var path = require('path')

const ServerManager = require('./server_manager');
const { WebUI } = require('./webui');

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

////////////////////////////////////////////////////////////////////////////////

const app = express();

app.use(function(req, res, next){
  if (ServerManager.inMaintenance) ServerManager.deferRequest(next);
  else next();
});

////////////////////////////////////////////////////////////////////////////////

app.use('/api', auth, function (err, req, res, next) {
  if (err) return next();
  return next(err);
});

apiServer.applyMiddleware({ app, path: '/api' });

////////////////////////////////////////////////////////////////////////////////

app.use('/attachment', express.static(
  process.env.ATTACHMENTS_DIR,
  { dotfiles:'allow' }
));

////////////////////////////////////////////////////////////////////////////////

const webui = new WebUI(path.join(__dirname, '..', 'webui'));

app.get('/', (req, res, next) => {
  if (req.url == "/") req.url = "/index.html";
  next();
});

app.get('/*.html', (req, res, next) => {
  if (! req.url.startsWith("/admin")) {
    const locale = webui.getOrSetLocale(req, res);
    req.url = path.join('html', locale, req.url);
  }
  next();
});

app.get('/admin', (req, res, next) => {
  req.url = "/admin.html";
  next();
});

app.get('/privacy', (req, res, next) => {
  req.url = "/privacy_policy.html";
  next();
});

app.use('/', (req, res, next) => {
  webui.handleRequest(req, res, next);
});

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

////////////////////////////////////////////////////////////////////////////////

module.exports = { app, apiServer }
