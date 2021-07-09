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

var testUser = null

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
  await TestData.approveBusinesses();
  await TestData.addEvents();
  await TestData.approveEvents();

  await Model.doMaintenance();
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

test('mutation.createPublicUser', async () => {

  const q = gql`
    mutation {
      createPublicUser
    }
  `;

  const result = await server.executeOperation({
    query: q
  });

  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();

  testUser = jsonwebtoken.decode(result.data.createPublicUser);

  expect(testUser.type).toBe('PUBLIC');
  expect(testUser.id).toBeDefined();

  TestData.publicUsers.push(testUser);
});

/////

test('mutation.authenticatePublicUser', async () => {

  const q = gql`
    mutation {
      authenticatePublicUser(id: "${testUser.id}")
    }
  `;

  const result = await server.executeOperation({
    query: q
  });

  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();

  var res = jsonwebtoken.decode(result.data.authenticatePublicUser);

  expect(res.type).toBe('PUBLIC');
  expect(res.id).toBe(testUser.id);
});

/////

test('query.user', async () => {

  const q = gql`
    query {
      user {
        id
        type
        create_time
        last_login
      }
    }
  `;

  const result = await server.executeOperation({
    query: q
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

test('query.business', async () => {

  const businesses = TestData.getBusinesses();

  for (const b of businesses) {
    const q = gql`
      query {
        business(id: ${b.id}) {
          id
          display_name
          display_picture
          city
          type
        }
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    expect(result.data.business).toBeDefined();

    expect(result.data.business.id).toStrictEqual(b.id.toString());
  }
});

/////

test('query.businesses', async () => {

  const types = [
    'SelfEmployedBusiness',
    'ChildEducationBusiness',
    'DomesticHelpBusiness',
    'BeautyBusiness',
    'TransportationBusiness',
    'HospitalityBusiness',
    'StationeryBusiness',
    'MadeInQatarBusiness',
    'SportsBusiness',
    'EntertainmentBusiness',
    'FoodBusiness',
    'CleaningAndMaintenanceBusiness',
  ];

  for (const t of types) {
    const q = gql`
      query {
        businesses(type: ${t}) {
          id
          display_name
          display_picture
          city
          type
        }
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    expect(result.data.businesses).toBeDefined();

    result.data.businesses.forEach(b => {
      expect(b.type).toBe(t);
    });

    const expected = TestData.getBusinesses(_ => _.type == t);
    expected.forEach(b => {
      expect(result.data.businesses.findIndex(_ => _.id == b.id))
      .not.toBe(-1);
    })
  }
});

/////

test('query.event', async () => {

  const events = TestData.getEvents();

  for (const e of events) {
    const q = gql`
      query {
        event(id: ${e.id}) {
          id
          display_name
          display_picture
          city
          type
        }
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    expect(result.data.event).toBeDefined();

    expect(result.data.event.id).toStrictEqual(e.id.toString());
  }
});

/////

test('query.events', async () => {

  const types = [
    'SEMINAR',
    'CONFERENCE',
    'WORKSHOP',
    'CEREMONY',
    'JOB_FAIR',
    'CONCERT',
    'OTHER',
  ];

  for (const t of types) {
    const q = gql`
      query {
        events(type: ${t}) {
          id
          display_name
          display_picture
          city
          type
        }
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    expect(result.data.events).toBeDefined();

    result.data.events.forEach(e => {
      expect(e.type).toBe(t);
    });

    const expected = TestData.getEvents(_ => _.type == t);
    expected.forEach(b => {
      expect(result.data.events.findIndex(_ => _.id == b.id))
      .not.toBe(-1);
    })
  }
});

/////

test('mutation.rateBusiness', async () => {
  TestData.publicUsers[0].rating = { };

  for (var bu in TestData.businesses) {
    for (var b of TestData.businesses[bu]) {
      TestData.publicUsers[0].rating[b.id] =
        Math.ceil(Math.random() * 5);

      const q = gql`
        mutation {
          rateBusiness(id: ${b.id}, stars: ${TestData.publicUsers[0].rating[b.id]})
        }
      `;

      const result = await server.executeOperation({
        query: q
      });

      expect(result.errors).toBeUndefined();
    }
  }
});

/////

test('query.user.rating', async () => {
  for (var bu in TestData.businesses) {
    for (var b of TestData.businesses[bu]) {

      const q = gql`
        query {
          user {
            rating(businessId: ${b.id})
          }
        }
      `;

      const result = await server.executeOperation({
        query: q
      });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      expect(result.data.user.rating)
        .toBe(TestData.publicUsers[0].rating[b.id]);
    }
  }
});

/////

test('mutation.sendMessage', async () => {
  TestData.publicUsers[0].threads = [];

  for (var bu in TestData.businesses) {
    for (var b of TestData.businesses[bu]) {

      const q = gql`
        mutation {
          sendMessage(msg: "hi", targetBusinessId: ${b.id}) {
            id
            senderLastSeenIndex
          }
        }
      `;

      const result = await server.executeOperation({
        query: q
      });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      TestData.publicUsers[0].threads.push(
        result.data.sendMessage.id
      );

      expect(result.data.sendMessage.senderLastSeenIndex).toBe(0)
    }
  }
});

/////

test('mutation.seeMessage', async () => {
  for (var id of TestData.publicUsers[0].threads) {
    const q = gql`
      mutation {
        seeMessage(threadId: ${id}, index: 0) {
          id
          senderLastSeenIndex
        }
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeDefined();
  }
});
