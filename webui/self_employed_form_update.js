
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('self-employed-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateSelfEmployedBusinessInput!) {
      updateSelfEmployedBusiness(id: $id, data: $data)
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

  await GraphQL.fillOptionsFromEnum("SelfEmployedSubType", [
    "self-employed-sub-type"
  ]);

  await GraphQL.fillOptionsFromEnum("Gender", [
    "self-employed-gender"
  ]);

  await GraphQL.fillOptionsFromEnum("Nationality", [
    "self-employed-nationality"
  ]);

  await GraphQL.fillOptionsFromEnum("City", [
    "self-employed-city",
  ]);

  await GraphQL.fillOptionsFromEnum("Currency", [
    "self-employed-charge-currency",
  ]);

  await GraphQL.fillOptionsFromEnum("Country", [
    "self-employed-experience-country"
  ]);

  if (data["update"]) data = data["update"];
  data["sub_type"] = data["selfEmployedSubType"];
  initialData = data;
  Form.putFormData('self-employed-form', data);
}
