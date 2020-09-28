
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('event-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateEventInput!) {
      updateEvent(id: $id, data: $data)
    }
  `, {
    id: initialData["id"],
    data: data
  }).then(res => {
    $("#loading-blanket").hide();

    if (! res.hasError) {
      alert("Your event has been updated.");
      queryOwnedEvents();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}


function initializeForm(data) {

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

    initialData = data;
    Form.putFormData('event-form', data);
  });
}
