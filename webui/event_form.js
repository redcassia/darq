
function submitForm() {
  var data;

  try {
    data = getFormData('event-form');
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
  GraphQL.fillOptionsFromEnum("EventType", [
    "event-type"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "event-city"
  ]);

  GraphQL.fillOptionsFromEnum("Currency", [
    "event-ticket-price-currency"
  ]);
});
