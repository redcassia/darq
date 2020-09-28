
var initialData;

function submitForm() {
  var data;

  try {
    data = Form.getFormData('cleaning-maintenance-form');
    data = Form.removeRedundancy(initialData, data);
    data = Form.splitAttachments(data, 'old_attachments', 'attachments');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: UpdateCleaningAndMaintenanceBusinessInput!) {
      updateCleaningAndMaintenanceBusiness(id: $id, data: $data)
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

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("CleaningAndMaintenanceBusinessSubType", [
      "cleaning-maintenance-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "cleaning-maintenance-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "cleaning-maintenance-fees-currency"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["cleaningAndMaintenanceSubType"];
    initialData = data;
    Form.putFormData('cleaning-maintenance-form', data);
  });
}
