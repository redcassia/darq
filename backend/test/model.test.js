const Model = require("../api/model");
const TestData = require("./test_data");

beforeAll(() => {
  Model.init();
})

/////

afterAll(() => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      Model.close();
      await TestData.removeData();
      resolve();
    }, 100);
  });
})

/////

test('Model.addBusinessUser', async () => {
  await TestData.addBusinessUsers();
});

/////

test('Model.addBusinessUser -> Model.setBusinessUserVerified', async () => {
  await TestData.setBusinessUsersVerified();
});

/////

test('Model.addBusinessUser -> Model.setBusinessUserVerified -> Model.verifyBusinessUser', async () => {
  await TestData.verifyBusinessUsers();
});

/////

test('Model.addBusinessUser -> Model.setBusinessUserVerified -> Model.verifyBusinessUser -> Model.businessUserLoader', async () => {
  for (var user in TestData.businessUsers) {
    const u = await Model.businessUserLoader.load(TestData.businessUsers[user].id);

    expect(u).toBeDefined();
    expect(u).not.toBeNull();

    expect(u.id).toBe(TestData.businessUsers[user].id)
    expect(u.email).toBe(TestData.businessUsers[user].email)
  }
});

/////

test('Model.addBusiness', async () => {
  await TestData.addBusinesses();
});

/////

test('Model.addBusiness -> Model.businessLoader', async () => {
  for (var user in TestData.businesses) {
    for (var bName in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][bName].id)

      expect(b).toBeDefined();
      expect(b).not.toBeNull();
  
      TestData.validate(b, TestData.businesses[user][bName]);
    }
  }
});

/////

test('Model.addBusiness -> Model.setBusinessApproveStatus', async () => {
  for (var user in TestData.businesses) {
    for (var bName in TestData.businesses[user]) {
      await Model.setBusinessApproveStatus(
        TestData.businesses[user][bName].id,
        true
      );
    }
  }

  for (var user in TestData.businesses) {
    for (var bName in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][bName].id)

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('APPROVED');
    }
  }
});

/////

test('Model.addBusiness -> Model.setBusinessApproveStatus -> Model.doMaintenance', async () => {
  await Model.doMaintenance();

  for (var user in TestData.businesses) {
    for (var bName in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][bName].id)

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('LISTED');
    }
  }
});
