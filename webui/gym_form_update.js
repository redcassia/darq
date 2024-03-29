
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateSportsBusiness",
    "UpdateSportsBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('gym-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("City", [
      "gym-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Genders", [
      "gym-genders"
    ]);
  
    if (data["update"]) data = data["update"];
    initialData = data;
    Form.putFormData('gym-form', data);
  });
}
