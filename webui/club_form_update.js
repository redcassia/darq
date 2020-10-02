
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateSportsBusiness",
    "UpdateSportsBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('club-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("City", [
      "club-city"
    ]);

    if (data["update"]) data = data["update"];
    initialData = data;
    Form.putFormData('club-form', data);
  });
}
