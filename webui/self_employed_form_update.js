
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateSelfEmployedBusiness",
    "UpdateSelfEmployedBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('self-employed-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("SelfEmployedSubType", [
      "self-employed-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("Gender", [
      "self-employed-gender"
    ]);

    await GraphQL.fillOptionsFromEnum("Nationality", [
      "self-employed-nationality"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "self-employed-city",
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "self-employed-charge-currency",
    ]);

    await GraphQL.fillOptionsFromEnum("Country", [
      "self-employed-experience-country"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["selfEmployedSubType"];
    initialData = data;
    Form.putFormData('self-employed-form', data);
  });
}
