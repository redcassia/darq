
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateCleaningAndMaintenanceBusiness",
    "UpdateCleaningAndMaintenanceBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('cleaning-maintenance-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
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
