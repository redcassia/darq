require('dotenv').config()
var express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
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
  typeDefs,
  resolvers,
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

module.exports = app
