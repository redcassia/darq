
function submitForm() {
  var data;

  try {
    data = Form.getFormData('event-form');
  }
  catch (e) {
    console.log(e);
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

    if (! res.hasError) {
      alert("Your event has been added. The data will be reviewed and we will contact you shortly.");
      queryOwnedEvents();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

$(document).ready(function() {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("EventType", [
      "event-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "event-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "event-ticket-price-currency"
    ]);
  });
});
