const { extendBusinessSubscription } = require("../api/model");
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

test('Model.addPublicUser', async () => {
  for (var i = 0; i < 3; ++i) {
    TestData.publicUsers.push({
      id: await Model.addPublicUser()
    });
  }
});

/////

test('Model.isValidPublicUser', async () => {
  for (var user of TestData.publicUsers) {
    const res = await Model.isValidPublicUser(user.id);

    expect(res).toBeTruthy();
  }
});

/////

test('Model.publicUserLoader.loadMany', async () => {
  var ids = TestData.publicUsers.map(_ => _.id);

  var users = await Model.publicUserLoader.loadMany(ids);

  expect(users.length).toBe(ids.length);
  for (var i in ids) {
    expect(users[i].id).toBe(ids[i]);
  }
});

/////

test('Model.publicUserLoader.load', async () => {
  for (var user of TestData.publicUsers) {
    var u = await Model.publicUserLoader.load(user.id);

    expect(u).toBeDefined();
    expect(u).not.toBeNull();

    expect(u.id).toBe(user.id)
  }
});

/////

test('Model.addBusinessUser', async () => {
  await TestData.addBusinessUsers();
});

/////

test('Model.setBusinessUserVerified', async () => {
  await TestData.verifyBusinessUsers();
});

/////

test('Model.isValidBusinessUser', async () => {
  for (var user in TestData.businessUsers) {
    const res = await Model.isValidBusinessUser(
      TestData.businessUsers[user].email,
      TestData.businessUsers[user].password
    );

    expect(res).toBeTruthy();
  }
});

/////

test('Model.changeBusinessUserPassword', async () => {
  for (var user in TestData.businessUsers) {
    await Model.changeBusinessUserPassword(
      TestData.businessUsers[user].id,
      TestData.businessUsers[user].password,
      TestData.businessUsers[user].new_password
    );
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

test('Model.requestResetBusinessUserPassword', async () => {
  for (var user in TestData.businessUsers) {
    TestData.businessUsers[user].token = await Model.requestResetBusinessUserPassword(
      TestData.businessUsers[user].email
    );
  }
});

/////

test('Model.resetBusinessUserPassword', async () => {
  for (var user in TestData.businessUsers) {
    await Model.resetBusinessUserPassword(
      TestData.businessUsers[user].email,
      TestData.businessUsers[user].token,
      TestData.businessUsers[user].reset_password
    );
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

test('Model.businessUserLoader.loadMany', async () => {
  var ids = [];

  for (var user in TestData.businessUsers) {
    ids.push(TestData.businessUsers[user].id);
  }

  const u = await Model.businessUserLoader.loadMany(ids);

  var i = 0;
  for (var user in TestData.businessUsers) {
    expect(u[i]).toBeDefined();
    expect(u[i]).not.toBeNull();

    expect(u[i].id).toBe(TestData.businessUsers[user].id)
    expect(u[i].email).toBe(TestData.businessUsers[user].email)

    ++i;
  }
});

/////

test('Model.businessUserLoader.load', async () => {
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

test('Model.businessLoader.loadMany', async () => {
  for (var user in TestData.businesses) {
    var ids = [];

    for (var i in TestData.businesses[user]) {
      ids.push(TestData.businesses[user][i].id);
    }

    var b = await Model.businessLoader.loadMany(ids);

    for (var i in TestData.businesses[user]) {
      expect(b[i]).toBeDefined();
      expect(b[i]).not.toBeNull();

      expect(b[i].id).toBe(ids[i]);

      expect(b[i].status).toBe('TENTATIVE');

      TestData.validate(b[i], TestData.businesses[user][i]);
    }
  }
});

/////

test('Model.businessLoader.load', async () => {
  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][i].id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('TENTATIVE');

      TestData.validate(b, TestData.businesses[user][i]);
    }
  }
});

/////

test('Model.getBusinessOwnedBy', async () => {
  for (var user in TestData.businesses) {
    var ids = [];

    for (var i in TestData.businesses[user]) {
      ids.push(TestData.businesses[user][i].id);
    }

    var b = await Model.getBusinessesOwnedBy(TestData.businessUsers[user].id);
    b = b.map(_ => _.id);

    expect(b.length).toBe(ids.length);
    for (var id of ids) {
      expect(b.indexOf(id)).not.toBe(-1);
    }
  }
});

/////

test('Model.getTentativeBusinesses', async () => {
  var ids = [];

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      ids.push(TestData.businesses[user][i].id);
    }
  }

  var b = await Model.getTentativeBusinesses();
  b = b.map(_ => _.id);

  expect(b.length).toBe(ids.length);
  for (var id of ids) {
    expect(b.indexOf(id)).not.toBe(-1);
  }
});

/////

test('Model.setBusinessApproveStatus', async () => {
  await TestData.approveBusinesses();

  var tentative = await Model.getTentativeBusinesses();
  expect(tentative.length).toBe(0);

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][i].id)

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('APPROVED');
    }
  }

  await Model.doMaintenance();

  tentative = await Model.getTentativeBusinesses();
  expect(tentative.length).toBe(0);

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      var b = await Model.businessLoader.load(TestData.businesses[user][i].id)

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('LISTED');
    }
  }
});

/////

test('Model.updateBusiness', async () => {
  await TestData.updateBusinesses();
});

/////

test('Model.getBusinessWithUpdate', async () => {
  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      if (! TestData.businessUpdates[user][i]) continue;

      var b = await Model.getBusinessWithUpdate(TestData.businesses[user][i].id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.update).toBeDefined();
      expect(b.update).not.toBeNull();

      expect(b.update.status).toBe('TENTATIVE');

      TestData.validate(b.update, TestData.updatedBusinesses[user][i], true);

      TestData.validate(b, TestData.businesses[user][i]);
    }
  }
});

/////

test('Model.getTentativeUpdatedBusinesses', async () => {
  var ids = [];

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      if (! TestData.businessUpdates[user][i]) continue;

      ids.push(TestData.businesses[user][i].id);
    }
  }

  var b = await Model.getTentativeUpdatedBusinesses();
  b = b.map(_ => _.id);

  expect(b.length).toBe(ids.length);
  for (var id of ids) {
    expect(b.indexOf(id)).not.toBe(-1);
  }
});

/////

test('Model.setBusinessUpdateApproveStatusIfExists', async () => {
  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      await Model.setBusinessUpdateApproveStatusIfExists(
        TestData.businesses[user][i].id,
        true
      );
    }
  }

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      var b = await Model.getBusinessWithUpdate(TestData.businesses[user][i].id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.update).toBeDefined();
      expect(b.update).toBeNull();

      expect(b.status).toBe('LISTED');

      TestData.validate(b, TestData.updatedBusinesses[user][i], true);
    }
  }
});

/////

test('Model.updateDomesticHelpPersonnel', async () => {
  await TestData.updatePersonnelOfDomesticHelpBusinesses();

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      var b = await Model.getBusinessWithUpdate(TestData.businesses[user][i].id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.update).toBeDefined();
      expect(b.update).toBeNull();

      expect(b.status).toBe('LISTED');

      TestData.validate(b, TestData.updatedBusinesses[user][i]);
    }
  }
});

/////

test('Model.setBusinessSubscriptionPrices', async () => {
  await Model.setBusinessSubscriptionPrices([
    {
      months: 1,
      amount: 100
    },
    {
      months: 3,
      amount: 280
    },
    {
      months: 6,
      amount: 560
    },
    {
      months: 12,
      amount: 1100
    }
  ]);
});

/////

test('Model.calculateBusinessSubscriptionPrice', async () => {
  const testValues = [
    { months: 1, expected: 100 },
    { months: 2, expected: 100 + 100 },
    { months: 3, expected: 280 },
    { months: 4, expected: 280 + 100 },
    { months: 5, expected: 280 + 100 + 100 },
    { months: 6, expected: 560 },
    { months: 7, expected: 560 + 100 },
    { months: 8, expected: 560 + 100 + 100 },
    { months: 9, expected: 560 + 280 },
    { months: 10, expected: 560 + 280 + 100 },
    { months: 11, expected: 560 + 280 + 100 + 100 },
    { months: 12, expected: 1100 },
  ];

  for (const t of testValues) {
    const res = await Model.calculateBusinessSubscriptionPrice(t.months);
    expect(res).toBe(t.expected);
  }
});

/////

test('Model.extendBusinessSubscription', async () => {
  for (const user in TestData.businesses) {
    const u = TestData.businessUsers[user];

    for (const b of TestData.businesses[user]) {
      var oldDate = new Date((await Model.businessLoader.load(b.id)).expiry_date);

      expect(oldDate > new Date()).toBeTruthy();

      var months = Math.floor(Math.random() * 12) + 1;

      try {
        await Model.extendBusinessSubscription(
          u.id,
          b.id,
          0,
          0
        );

        expect(true).toBeFalsy();
      }
      catch(ignored) { }

      try {
        await Model.extendBusinessSubscription(
          u.id,
          b.id,
          13,
          await Model.calculateBusinessSubscriptionPrice(13)
        );

        expect(true).toBeFalsy();
      }
      catch(ignored) { }

      try {
        await Model.extendBusinessSubscription(
          u.id,
          b.id,
          -1,
          await Model.calculateBusinessSubscriptionPrice(-1)
        );

        expect(true).toBeFalsy();
      }
      catch(ignored) { }

      await Model.extendBusinessSubscription(
        u.id,
        b.id,
        months,
        await Model.calculateBusinessSubscriptionPrice(months)
      );

      var newDate = new Date((await Model.businessLoader.load(b.id)).expiry_date);
      var expectedNewDate = new Date(oldDate.setMonth(oldDate.getMonth() + months));
      expect(newDate).toStrictEqual(expectedNewDate);
    }
  }
});

/////

test('Model.setBusinessRating', async () => {
  for (var user in TestData.publicUsers) {
    TestData.publicUsers[user].rating = { };

    for (var bu in TestData.businesses) {
      for (var b of TestData.businesses[bu]) {
        TestData.publicUsers[user].rating[b.id] =
          Math.ceil(Math.random() * 5);

        await Model.setBusinessRating(
          TestData.publicUsers[user].id,
          b.id,
          TestData.publicUsers[user].rating[b.id]
        );
      }
    }
  }
});

/////

test('Model.getBusinessRating', async () => {
  for (var user in TestData.publicUsers) {
    for (var bu in TestData.businesses) {
      for (var b of TestData.businesses[bu]) {
        const r = await Model.getBusinessRating(
          TestData.publicUsers[user].id,
          b.id
        );

        expect(r).toBe(TestData.publicUsers[user].rating[b.id]);
      }
    }
  }
});

/////

test('Model.createMessageThread', async () => {
  for (var user in TestData.publicUsers) {
    TestData.publicUsers[user].threads = [];

    for (var bu in TestData.businesses) {
      for (var b of TestData.businesses[bu]) {
        TestData.publicUsers[user].threads.push(
          await Model.createMessageThread(
            b.id,
            TestData.publicUsers[user].id
          )
        );
      }
    }
  }
});

/////

test('Model.getMessageThreadIDsOwnedByPublicUser', async () => {
  for (var user in TestData.publicUsers) {
    const threadIDs = await Model.getMessageThreadIDsOwnedByPublicUser(
      TestData.publicUsers[user].id
    );

    expect(threadIDs.length).toBe(TestData.publicUsers[user].threads.length);
    for (var id of TestData.publicUsers[user].threads) {
      expect(threadIDs.indexOf(id)).not.toBe(-1);
    }
  }
});

/////

test('Model.getMessageThreadIDsOwnedByBusinessUser', async () => {
  for (var user in TestData.businessUsers) {
    if (! TestData.businesses[user]) continue;

    const threadIDs = await Model.getMessageThreadIDsOwnedByBusinessUser(
      TestData.businessUsers[user].id
    );

    expect(
      threadIDs.length
    ).toBe(
      TestData.publicUsers.length * TestData.businesses[user].length
    );
  }
});

/////

test('Model.msgThreadLoader.loadMany', async () => {
  for (var user in TestData.publicUsers) {
    var t = await Model.msgThreadLoader.loadMany(
      TestData.publicUsers[user].threads
    );
    t = t.map(_ => _.id);

    expect(t).toStrictEqual(TestData.publicUsers[user].threads);
  }
});

/////

test('Model.msgThreadLoader.load', async () => {
  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.msgThreadLoader.load(id);

      expect(t).toBeDefined();
      expect(t).not.toBeNull();

      expect(t.id).toBe(id);
      expect(t.public_user_id).toBe(TestData.publicUsers[user].id);
      expect(t.targetLastSeenIndex).toBeNull();
      expect(t.senderLastSeenIndex).toBeNull();
    }
  }
});

/////

test('Model.addMessageToThread', async () => {
  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var i = await Model.addMessageToThread(id, "hi", 'PUBLIC');
      expect(i).toBe(0);

      var i = await Model.addMessageToThread(id, "hello", 'BUSINESS');
      expect(i).toBe(1);
    }
  }
});

/////

test('Model.msgLoader.loadMany', async () => {
  for (var user in TestData.publicUsers) {
    var messages = await Model.msgLoader.loadMany(TestData.publicUsers[user].threads);

    expect(messages.length).toBe(TestData.publicUsers[user].threads.length);
    for (var m of messages) {
      expect(m).not.toBeNull();

      expect(m.length).toBe(2);

      expect(m[0].index).toBe(0);
      expect(m[0].msg).toBe("hi");

      expect(m[1].index).toBe(1);
      expect(m[1].msg).toBe("hello");
    }
  }
});

/////

test('Model.msgLoader.load', async () => {
  for (var user in TestData.publicUsers) {
    for (var t of TestData.publicUsers[user].threads) {
      var m = await Model.msgLoader.load(t);

      expect(m).not.toBeNull();

      expect(m.length).toBe(2);

      expect(m[0].index).toBe(0);
      expect(m[0].msg).toBe("hi");

      expect(m[1].index).toBe(1);
      expect(m[1].msg).toBe("hello");
    }
  }
});

/////

test('Model.setThreadSeeIndexForTarget', async () => {
  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.msgThreadLoader.load(id);

      expect(t).toBeDefined();
      expect(t).not.toBeNull();

      expect(t.id).toBe(id);
      expect(t.public_user_id).toBe(TestData.publicUsers[user].id);
      expect(t.targetLastSeenIndex).toBeNull();
    }
  }

  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.setThreadSeeIndexForTarget(
        await Model.msgThreadLoader.load(id),
        1
      );
    }
  }

  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.msgThreadLoader.load(id);

      expect(t).toBeDefined();
      expect(t).not.toBeNull();

      expect(t.id).toBe(id);
      expect(t.public_user_id).toBe(TestData.publicUsers[user].id);
      expect(t.targetLastSeenIndex).toBe(1);
    }
  }
});

/////

test('Model.setThreadSeeIndexForSender', async () => {
  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.msgThreadLoader.load(id);

      expect(t).toBeDefined();
      expect(t).not.toBeNull();

      expect(t.id).toBe(id);
      expect(t.public_user_id).toBe(TestData.publicUsers[user].id);
      expect(t.senderLastSeenIndex).toBeNull();
    }
  }

  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.setThreadSeeIndexForSender(
        await Model.msgThreadLoader.load(id),
        1
      );
    }
  }

  for (var user in TestData.publicUsers) {
    for (var id of TestData.publicUsers[user].threads) {
      var t = await Model.msgThreadLoader.load(id);

      expect(t).toBeDefined();
      expect(t).not.toBeNull();

      expect(t.id).toBe(id);
      expect(t.public_user_id).toBe(TestData.publicUsers[user].id);
      expect(t.senderLastSeenIndex).toBe(1);
    }
  }
});

/////

test('Model.deleteBusiness', async () => {

  var att = [];
  var ids = [];

  for (var user in TestData.businesses) {
    for (var i in TestData.businesses[user]) {
      if (! TestData.businessesDeletes[user][i]) continue;

      const id = TestData.businesses[user][i].id;
      ids.push(id);

      var b = await Model.businessLoader.load(id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('LISTED');

      att = att.concat(TestData.attachmentsOf(b));

      await Model.deleteBusiness(id);

      b = await Model.businessLoader.load(id);

      expect(b).toBeDefined();
      expect(b).not.toBeNull();

      expect(b.status).toBe('DELETED');
    }
  }

  await Model.doMaintenance();

  for (var id of ids) {
    var b = await Model.businessLoader.load(id);

    expect(b).toBeDefined();
    expect(b).toBeNull();
  }

  att.forEach(_ => {
    expect(TestData.attachmentExists(_)).toBeFalsy();
    expect(TestData.attachmentThumbnailExists(_)).toBeFalsy();
  });
});

/////

test('Model.addEvents', async () => {
  await TestData.addEvents();
});

/////

test('Model.eventLoader.loadMany', async () => {
  for (var user in TestData.events) {
    var ids = [];

    for (var i in TestData.events[user]) {
      ids.push(TestData.events[user][i].id);
    }

    var e = await Model.eventLoader.loadMany(ids);

    for (var i in TestData.events[user]) {
      expect(e[i]).toBeDefined();
      expect(e[i]).not.toBeNull();

      expect(e[i].id).toBe(ids[i]);

      expect(e[i].status).toBe('TENTATIVE');

      TestData.validate(e[i], TestData.events[user][i]);
    }
  }
});

/////

test('Model.eventLoader.load', async () => {
  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      var e = await Model.eventLoader.load(TestData.events[user][i].id);

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('TENTATIVE');

      TestData.validate(e, TestData.events[user][i]);
    }
  }
});

/////

test('Model.getEventsOwnedBy', async () => {
  for (var user in TestData.events) {
    var ids = [];

    for (var i in TestData.events[user]) {
      ids.push(TestData.events[user][i].id);
    }

    var e = await Model.getEventsOwnedBy(TestData.businessUsers[user].id);
    e = e.map(_ => _.id);

    expect(e.length).toBe(ids.length);
    for (var id of ids) {
      expect(e.indexOf(id)).not.toBe(-1);
    }
  }
});

/////

test('Model.getTentativeEvents', async () => {
  var ids = [];

  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      ids.push(TestData.events[user][i].id);
    }
  }

  var e = await Model.getTentativeEvents();
  e = e.map(_ => _.id);

  expect(e.length).toBe(ids.length);
  for (var id of ids) {
    expect(e.indexOf(id)).not.toBe(-1);
  }
});

/////

test('Model.setEventApproveStatus', async () => {
  await TestData.approveEvents();

  var tentative = await Model.getTentativeEvents();
  expect(tentative.length).toBe(0);

  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      var e = await Model.eventLoader.load(TestData.events[user][i].id)

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('APPROVED');
    }
  }

  await Model.doMaintenance();

  tentative = await Model.getTentativeEvents();
  expect(tentative.length).toBe(0);

  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      var e = await Model.eventLoader.load(TestData.events[user][i].id)

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('LISTED');
    }
  }
});

/////

test('Model.updateEvent', async () => {
  await TestData.updateEvents();

  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      if (! TestData.eventUpdates[user][i]) continue;

      var e = await Model.eventLoader.load(TestData.events[user][i].id);

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('LISTED');

      TestData.validate(e, TestData.updatedEvents[user][i]);
    }
  }
});

/////

test('Model.deleteEvent', async () => {

  var att = [];
  var ids = [];

  for (var user in TestData.events) {
    for (var i in TestData.events[user]) {
      if (! TestData.eventDeletes[user][i]) continue;

      const id = TestData.events[user][i].id;
      ids.push(id);

      var e = await Model.eventLoader.load(id);

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('LISTED');

      att = att.concat(TestData.attachmentsOf(e));

      await Model.deleteEvent(id);

      e = await Model.eventLoader.load(id);

      expect(e).toBeDefined();
      expect(e).not.toBeNull();

      expect(e.status).toBe('DELETED');
    }
  }

  await Model.doMaintenance();

  for (var id of ids) {
    var e = await Model.eventLoader.load(id);

    expect(e).toBeDefined();
    expect(e).toBeNull();
  }

  att.forEach(_ => {
    expect(TestData.attachmentExists(_)).toBeFalsy();
    expect(TestData.attachmentThumbnailExists(_)).toBeFalsy();
  });
});
