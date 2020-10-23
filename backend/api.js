require('dotenv').config()
var express = require('express');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const jwt = require('express-jwt')
var fs = require('fs')
var path = require('path')

const typeDefs = gql(fs.readFileSync(path.join(__dirname, "api/schema.graphql"), "utf-8"));
const resolvers = require('./api/resolvers');

// authentication middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    inheritResolversFromInterfaces: true
  }),
  context: (integrationCtx) => ({
    user: integrationCtx.req.user
  }),
  debug: false
});

const app = express();
app.use('/api', auth, function (err, req, res, next) {
  if (err) return next();
  return next(err);
});
server.applyMiddleware({ app, path: '/api' });

app.use('/', express.static(path.join(__dirname, '..', 'webui')));
app.use('/attachment', express.static(process.env.ATTACHMENTS_DIR));
app.use('/admin', express.static(path.join(__dirname, '..', 'webui', 'admin.html')));

module.exports = app
