var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fs = require('fs')
var path = require('path')

const schema = buildSchema(fs.readFileSync(path.join(__dirname, "api/schema.graphql"), "utf-8"));
var resolvers = require('./api/resolvers');

exports.app = express();
exports.app.use('/api', graphqlHTTP({
  schema: schema,
  rootValue: resolvers.root,
  graphiql: true,
}));
