
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateChildEducationBusiness",
    "UpdateChildEducationBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('child-education-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("ChildEducationSubType", [
      "child-education-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "child-education-city"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["childEducationSubType"];
    initialData = data;
    Form.putFormData('child-education-form', data);
  });
}
