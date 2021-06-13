
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateStationeryBusiness",
    "UpdateStationeryBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('stationery-form');
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
        name: "City",
        ids: [
          "stationery-city"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    initialData = data;
    Form.putFormData('stationery-form', data);
  });
}
