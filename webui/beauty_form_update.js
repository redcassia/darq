
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateBeautyBusiness",
    "UpdateBeautyBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('beauty-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("BeautyBusinessSubType", [
      "beauty-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "beauty-city"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["beautySubType"];
    initialData = data;
    Form.putFormData('beauty-form', data);
  });
}
