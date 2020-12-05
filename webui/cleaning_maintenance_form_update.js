
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "CleaningAndMaintenanceBusinessSubType",
        ids: [
          "cleaning-maintenance-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "cleaning-maintenance-city"
        ]
      },
      {
        name: "Currency",
        ids: [
          "cleaning-maintenance-fees-currency"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["cleaningAndMaintenanceSubType"];
    initialData = data;
    Form.putFormData('cleaning-maintenance-form', data);
  });
}
