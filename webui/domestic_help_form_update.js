
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateDomesticHelpBusiness",
    "UpdateDomesticHelpBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('domestic-help-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function updateProfessionRelevantFields(val, node) {

  for (var line of node.children) {
    if (line.classList.contains('form-line') && line.attributes['data-show-with']) {
      var show = line.attributes['data-show-with'].value;
      if (show.indexOf(val) != -1) {
        $(line).show();
        Form.setRequired(line, true);
      }
      else {
        $(line).hide();
        Form.setRequired(line, false);
      }
    }
  }
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("DomesticHelpSubType", [
      "domestic-help-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "domestic-help-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Profession", [
      "domestic-help-personnel-profession"
    ]);

    await GraphQL.fillOptionsFromEnum("Gender", [
      "domestic-help-personnel-gender"
    ]);

    await GraphQL.fillOptionsFromEnum("Nationality", [
      "domestic-help-personnel-nationality"
    ]);

    await GraphQL.fillOptionsFromEnum("MaritalStatus", [
      "domestic-help-personnel-marital-status"
    ]);

    await GraphQL.fillOptionsFromEnum("Education", [
      "domestic-help-personnel-education"
    ]);

    await GraphQL.fillOptionsFromEnum("Country", [
      "domestic-help-personnel-experience-country"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "domestic-help-personnel-salary-currency"
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["domesticHelpSubType"];
    initialData = data;
    Form.putFormData('domestic-help-form', data);
  });
}
