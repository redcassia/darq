
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateFoodBusiness",
    "UpdateFoodBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('cuisine-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_menu', 'menu');
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("FoodBusinessSubType", [
      "cuisine-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "cuisine-city"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["foodSubType"];
    initialData = data;
    Form.putFormData('cuisine-form', data);
  });
}
