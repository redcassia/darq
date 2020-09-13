
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('entertainment-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateEntertainmentBusinessInput!) {
      updateEntertainmentBusiness(id: $id, data: $data)
    }
  `, {
    id: initialData["id"],
    data: data
  }).then(res => {
    $("#loading-blanket").hide();

    if (! res.hasError) {
      alert("Your business has been updated. The data will be reviewed and we will contact you shortly.");
      queryOwnedBusinesses();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

async function initializeForm(data) {

  await GraphQL.fillOptionsFromEnum("EntertainmentBusinessSubType", [
    "entertainment-sub-type"
  ]);

  await GraphQL.fillOptionsFromEnum("City", [
    "entertainment-city"
  ]);

  if (data["update"]) data = data["update"];
  data["sub_type"] = data["entertainmentSubType"];
  initialData = data;
  Form.putFormData('entertainment-form', data);
}
