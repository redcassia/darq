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

var businesses = { };
var events = [ ];

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

test('mutation.createBusinessUser', async () => {

  for (var user in TestData.businessUsers) {
      const q = gql`
      mutation {
        createBusinessUser(
          email: "${TestData.businessUsers[user].email}",
          password: "${TestData.businessUsers[user].password}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
  }
});

/////

test('mutation.verifyBusinessUser', async () => {

  await TestData.removeData();

  await TestData.addBusinessUsers();

  for (var user in TestData.businessUsers) {
      const q = gql`
      mutation {
        verifyBusinessUser(
          email: "${TestData.businessUsers[user].email}",
          token: "${TestData.businessUsers[user].token}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    TestData.businessUsers[user].userObj = jsonwebtoken.decode(result.data.verifyBusinessUser);

    expect(TestData.businessUsers[user].userObj.type).toBe('BUSINESS');
    expect(TestData.businessUsers[user].userObj.id).toBeDefined();
  }
});

/////

test('mutation.authenticateBusinessUser', async () => {

  for (var user in TestData.businessUsers) {
    const q = gql`
      mutation {
        authenticateBusinessUser(
          email: "${TestData.businessUsers[user].email}",
          password: "${TestData.businessUsers[user].password}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    var userObj = jsonwebtoken.decode(result.data.authenticateBusinessUser);

    expect(userObj.type).toBe('BUSINESS');
    expect(userObj.id).toBe(TestData.businessUsers[user].userObj.id);
  }
});

/////

test('mutation.changeBusinessUserPassword', async () => {
  for (var user in TestData.businessUsers) {
    testUser = TestData.businessUsers[user].userObj;

    const q = gql`
      mutation {
        changeBusinessUserPassword(
          oldPassword: "${TestData.businessUsers[user].password}",
          newPassword: "${TestData.businessUsers[user].new_password}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
  }

  for (var user in TestData.businessUsers) {
    const res = await Model.isValidBusinessUser(
      TestData.businessUsers[user].email,
      TestData.businessUsers[user].new_password
    );

    expect(res).toBeTruthy();
  }
});

/////

test('mutation.requestBusinessUserPasswordReset', async () => {
  testUser = null;

  for (var user in TestData.businessUsers) {
    const q = gql`
      mutation {
        requestBusinessUserPasswordReset(
          email: "${TestData.businessUsers[user].email}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
  }
});

/////

test('mutation.resetBusinessUserPassword', async () => {
  testUser = null;

  for (var user in TestData.businessUsers) {
    TestData.businessUsers[user].token = await Model.requestResetBusinessUserPassword(
      TestData.businessUsers[user].email
    );
  }

  for (var user in TestData.businessUsers) {
    const q = gql`
      mutation {
        resetBusinessUserPassword(
          email: "${TestData.businessUsers[user].email}",
          token: "${TestData.businessUsers[user].token}",
          newPassword: "${TestData.businessUsers[user].reset_password}"
        )
      }
    `;

    const result = await server.executeOperation({
      query: q
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();

    var userObj = jsonwebtoken.decode(result.data.resetBusinessUserPassword);

    expect(userObj.type).toBe('BUSINESS');
    expect(userObj.id).toBe(TestData.businessUsers[user].userObj.id);
  }

  for (var user in TestData.businessUsers) {
    const res = await Model.isValidBusinessUser(
      TestData.businessUsers[user].email,
      TestData.businessUsers[user].reset_password
    );

    expect(res).toBeTruthy();
  }
});

/////

const businessTypes = [
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

for (const t of businessTypes) {

  test(`mutation.add${t}`, async () => {
    testUser = TestData.businessUsers.a.userObj;

    var b = TestData.getBusinesses(
      _ => _.type == t
    )[0];

    const q = gql`
      mutation($data: New${t}Input!) {
        add${t}(
          data: $data
        )
      }
    `;

    const result = await server.executeOperation({
      query: q,
      variables: {
        data: TestData.prepareBusinessForGraphQL(b)
      }
    });

    expect(result.errors).toBeUndefined();

    var owned = await Model.getBusinessesOwnedBy(TestData.businessUsers.a.userObj.id);
    const i = owned.findIndex(_ => _.display_name == b.display_name);

    expect(i).not.toBe(-1);

    TestData.validate(owned[i], b);

    businesses[t] = owned[i];
  });

  /////

  test(`mutation.update${t}`, async () => {
    testUser = TestData.businessUsers.a.userObj;

    var b = TestData.getBusinessUpdates(
      _ => _.display_name == businesses[t].display_name
    )[0];

    var bb = TestData.getUpdatedBusinesses(
      _ => _.display_name == businesses[t].display_name
    )[0];

    const q = gql`
      mutation($id: ID!, $data: Update${t}Input!) {
        update${t}(
          id: $id,
          data: $data
        )
      }
    `;

    const result = await server.executeOperation({
      query: q,
      variables: {
        id: businesses[t].id,
        data: TestData.prepareBusinessForGraphQL(b)
      }
    });

    expect(result.errors).toBeUndefined();

    var actual = await Model.getBusinessWithUpdate(businesses[t].id);

    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();

    TestData.validate(actual.update, bb);
  });
}

/////

test('mutation.addEvent', async () => {
  testUser = TestData.businessUsers.a.userObj;

  var e = TestData.getEvents()[0];

  const q = gql`
    mutation($data: NewEventInput!) {
      addEvent(
        data: $data
      )
    }
  `;

  const result = await server.executeOperation({
    query: q,
    variables: {
      data: TestData.prepareEventForGraphQL(e)
    }
  });

  expect(result.errors).toBeUndefined();

  var owned = await Model.getEventsOwnedBy(TestData.businessUsers.a.userObj.id);
  const i = owned.findIndex(_ => _.display_name == e.display_name);

  expect(i).not.toBe(-1);

  TestData.validate(owned[i], e);

  events.push(owned[i]);
});

/////

test('mutation.updateEvent', async () => {
  testUser = TestData.businessUsers.a.userObj;

  var e = TestData.getEventUpdates(
    _ => _.display_name == events[0].display_name
  )[0];

  var ee = TestData.getUpdatedEvents(
    _ => _.display_name == events[0].display_name
  )[0];

  const q = gql`
    mutation($id: ID!, $data: UpdateEventInput!) {
      updateEvent(
        id: $id,
        data: $data
      )
    }
  `;

  const result = await server.executeOperation({
    query: q,
    variables: {
      id: events[0].id,
      data: TestData.prepareEventForGraphQL(e)
    }
  });

  expect(result.errors).toBeUndefined();

  var actual = await Model.eventLoader.load(events[0].id);

  expect(actual).toBeDefined();
  expect(actual).not.toBeNull();

  TestData.validate(actual, ee);
});

/////

test('mutation.deleteBusiness', async () => {
  testUser = TestData.businessUsers.a.userObj;

  for (var i in businesses) {
    const q = gql`
      mutation($id: ID!) {
        deleteBusiness(
          id: $id
        )
      }
    `;

    const result = await server.executeOperation({
      query: q,
      variables: {
        id: businesses[i].id
      }
    });

    expect(result.errors).toBeUndefined();
  }
});

/////

test('mutation.deleteEvent', async () => {
  testUser = TestData.businessUsers.a.userObj;

  for (var i in events) {
    const q = gql`
      mutation($id: ID!) {
        deleteEvent(
          id: $id
        )
      }
    `;

    const result = await server.executeOperation({
      query: q,
      variables: {
        id: events[i].id
      }
    });

    expect(result.errors).toBeUndefined();
  }
});
