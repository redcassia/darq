require('dotenv').config()
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const jsonwebtoken = require('jsonwebtoken');
var fs = require('fs')
var path = require('path')

const ServerManager = require('../server_manager');

const Model = require("../api/model");
const TestData = require("./test_data");

const typeDefs = gql(fs.readFileSync(path.join(__dirname, "../api/schema.graphql"), "utf-8"));
const resolvers = require('../api/resolvers');

var testUser = null;
var tentative = null;

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
    inheritResolversFromInterfaces: true
  }),
  context: (integrationCtx) => ({
    user: testUser
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
  debug: true
});

/////

beforeAll(async () => {
  await server.start();

  await TestData.addBusinessUsers();
  await TestData.verifyBusinessUsers();
  await TestData.addBusinesses();
  await TestData.addEvents();
});

/////

afterAll(async () => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await server.stop();
      await TestData.removeData();
      resolve();
    }, 100);
  });
});

/////

test('mutation.authenticateAdmin', async () => {

  const q = gql`
    mutation {
      authenticateAdmin(
        key: "admin",
      )
    }
  `;

  const result = await server.executeOperation({
    query: q
  });

  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();

  testUser = jsonwebtoken.decode(result.data.authenticateAdmin);

  expect(testUser.type).toBe('ADMIN');
});

/////

test('query.admin.tentativeNewBusinesses', async () => {

  const q = gql`
    query {
      admin {
        tentativeNewBusinesses {
          id
        }
      }
    }
  `;

  const result = await server.executeOperation({
    query: q
  });

  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();

  tentative = result.data.admin.tentativeNewBusinesses;

  expect(tentative.length).not.toBe(0);
});

/////

test('mutation.reviewBusiness', async () => {
  for (var b of tentative) {
    var actual = await Model.businessLoader.load(b.id);

    expect(actual.status).toBe('TENTATIVE');

    const q = gql`
      mutation {
        reviewBusiness(id: "${b.id}", approve: true)
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();

    actual = await Model.businessLoader.load(b.id);

    expect(actual.status).toBe('APPROVED');
  }

  await Model.doMaintenance();

  for (var b of tentative) {
    var actual = await Model.businessLoader.load(b.id);

    expect(actual.status).toBe('LISTED');
  }
});

/////

test('query.admin.tentativeNewEvents', async () => {

  const q = gql`
    query {
      admin {
        tentativeNewEvents {
          id
        }
      }
    }
  `;

  const result = await server.executeOperation({
    query: q
  });

  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();

  tentative = result.data.admin.tentativeNewEvents;

  expect(tentative.length).not.toBe(0);
});

/////

test('mutation.reviewEvent', async () => {
  for (var e of tentative) {
    var actual = await Model.eventLoader.load(e.id);

    expect(actual.status).toBe('TENTATIVE');

    const q = gql`
      mutation {
        reviewEvent(id: "${e.id}", approve: true)
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();

    actual = await Model.eventLoader.load(e.id);

    expect(actual.status).toBe('APPROVED');
  }

  await Model.doMaintenance();

  for (var e of tentative) {
    var actual = await Model.eventLoader.load(e.id);

    expect(actual.status).toBe('LISTED');
  }
});
