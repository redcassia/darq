
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('club-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id, ID!, $data: UpdateSportsBusinessInput!) {
      updateSportsBusiness(id: $id, data: $data)
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

  await GraphQL.fillOptionsFromEnum("City", [
    "club-city"
  ]);

  if (data["update"]) data = data["update"];
  initialData = data;
  Form.putFormData('club-form', data);
}