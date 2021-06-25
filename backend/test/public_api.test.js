require('dotenv').config()
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const jsonwebtoken = require('jsonwebtoken');
var fs = require('fs')
var path = require('path')

const ServerManager = require('../server_manager');

const typeDefs = gql(fs.readFileSync(path.join(__dirname, "../api/schema.graphql"), "utf-8"));
const resolvers = require('../api/resolvers');

var testUser = { }

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    inheritResolversFromInterfaces: true
  }),
  context: (integrationCtx) => ({
    user: testUser
  }),
  debug: true
});

/////

beforeAll(async () => {
  await ServerManager.begin();
});

/////

test('mutation.createPublicUser', async () => {

  const result = await server.executeOperation({
    query: `
      mutation {
        createPublicUser
      }
    `
  });

  expect(result.errors).toBeUndefined();

  testUser = jsonwebtoken.decode(result.data.createPublicUser);

  expect(testUser.type).toBe('PUBLIC');
  expect(testUser.id).toBeDefined();
});

/////

test('query.user', async () => {

  const result = await server.executeOperation({
    query: `
      query {
        user {
          id
          type
          create_time
          last_login
        }
      }
    `
  });

  expect(result.errors).toBeUndefined();

  expect(result.data).toBeDefined();
  
  expect(result.data.user).toBeDefined();

  expect(result.data.user.id).toBe(testUser.id);
  expect(result.data.user.type).toBe(testUser.type);
  expect(result.data.user.create_time).not.toBeNull();
  expect(result.data.user.last_login).not.toBeNull();
});

/////

afterAll(async () => {
  await ServerManager.end();
});
