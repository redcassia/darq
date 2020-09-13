
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('hospitality-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateHospitalityBusinessInput!) {
      updateHospitalityBusiness(id: $id, data: $data)
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

function initializeForm(data) {
  if (data["update"]) data = data["update"];
  data["sub_type"] = data["hospitalitySubType"];
  initialData = data;
  Form.putFormData('hospitality-form', data);
}

