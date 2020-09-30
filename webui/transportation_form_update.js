
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateTransportationBusiness",
    "UpdateTransportationBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('transportation-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
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
  });
}
