
var initialData;

function submitForm() {
  if (!Form.tryLock()) return;

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

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateEventInput!) {
      updateEvent(id: $id, data: $data)
    }
  `, {
    id: initialData["id"],
    data: data
  }).then(async (res) => {
    Form.unlock();

    if (!res.hasError) {
      await alert(getString('EVENT_UPDATE_SUCCESS_ALERT'));
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      await alert(getString('EVENT_UPDATE_FAIL_ALERT'));
    }
  }).catch(async (e) => {
    Form.unlock();

    console.log(e);
    await alert(getString('EVENT_UPDATE_FAIL_ALERT'));
  });
}


function initializeForm(data) {

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

    initialData = data;
    Form.putFormData('event-form', data);
  });
}
