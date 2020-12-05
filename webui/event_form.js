
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

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: NewEventInput!) {
      addEvent(data: $data)
    }
  `, {
    "data": data
  }).then(res => {
    $("#loading-blanket").hide();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('EVENT_ADD_SUCCESS_ALERT'));
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('EVENT_ADD_FAIL_ALERT'));
    }
  }).catch(e => {
    $("#loading-blanket").hide();
    Form.unlock();

    console.log(e);
    alert(getString('EVENT_ADD_FAIL_ALERT'));
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

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
