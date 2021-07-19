
function submitForm() {
  if (! Form.tryLock()) return;

  var data;
  try {
    data = Form.getFormData('event-form');
  }
  catch (e) {
    console.log(e);
    Form.unlock();
    return;
  }

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($data: NewEventInput!) {
      addEvent(data: $data)
    }
  `, {
    "data": data
  }).then(async (res) => {
    Form.unlock();

    if (! res.hasError) {
      await alert(getString('EVENT_ADD_SUCCESS_ALERT'));
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      await alert(getString('EVENT_ADD_FAIL_ALERT'));
    }
  }).catch(async (e) => {
    Form.unlock();

    console.log(e);
    await alert(getString('EVENT_ADD_FAIL_ALERT'));
  });
}

$(document).ready(function() {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "EventType",
        ids: [
          "event-type"
        ]
      },
      {
        name: "City",
        ids: [
          "event-city"
        ]
      },
      {
        name: "Currency",
        ids: [
          "event-ticket-price-currency"
        ]
      }
    ]);

  });
});
