
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
      alert("Your event has been added. The data will be reviewed and we will contact you shortly.");
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert("Failed to add event");
    }
  }).catch(e => {
    $("#loading-blanket").hide();
    Form.unlock();

    console.log(e);
    alert("Failed to add event");
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

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
