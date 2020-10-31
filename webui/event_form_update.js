
var initialData;

function submitForm() {
  if (! Form.tryLock()) return;

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
    Form.unlock();

    if (! res.hasError) {
      alert(getString('EVENT_UPDATE_SUCCESS_ALERT'));
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('EVENT_UPDATE_FAIL_ALERT'));
    }
  }).catch(e => {
    $("#loading-blanket").hide();
    Form.unlock();

    console.log(e);
    alert(getString('EVENT_UPDATE_FAIL_ALERT'));
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
