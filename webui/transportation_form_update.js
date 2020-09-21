
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('transportation-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateTransportationBusinessInput!) {
      updateTransportationBusiness(id: $id, data: $data)
    }
  `, {
    id: initialData["id"],
    data: data
  }).then(res => {
    $("#loading-blanket").hide();

    if (! res.hasError) {
      alert("Your business has been added. The data will be reviewed and we will contact you shortly.");
      queryOwnedBusinesses();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

async function initializeForm(data) {

  await GraphQL.fillOptionsFromEnum("TransportationBusinessSubType", [
    "transportation-sub-type"
  ]);

  await GraphQL.fillOptionsFromEnum("City", [
    "transportation-city"
  ]);

  if (data["update"]) data = data["update"];
  data["sub_type"] = data["transportationSubType"];
  initialData = data;
  Form.putFormData('transportation-form', data);
}
