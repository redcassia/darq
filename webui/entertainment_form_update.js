
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateEntertainmentBusiness",
    "UpdateEntertainmentBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('entertainment-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
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
  });
}
