
function submitForm() {
  submitAddBusinessForm(
    "addDomesticHelpBusiness",
    "NewDomesticHelpBusinessInput",
    () => {
      return Form.getFormData('domestic-help-form');
    }
  );
}

function updateProfessionRelevantFields(val, node) {

  for (var line of node.children) {
    if (line.classList.contains('form-line') && line.attributes['data-show-with']) {
      var show = line.attributes['data-show-with'].value;
      if (show.indexOf(val) != -1) {
        $(line).removeClass("hidden");
        Form.setRequired(line, true);
      }
      else {
        $(line).addClass("hidden");
        Form.setRequired(line, false);
      }
    }
  }
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "DomesticHelpSubType",
        ids: [
          "domestic-help-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "domestic-help-city"
        ]
      },
      {
        name: "Profession",
        ids: [
          "domestic-help-personnel-profession"
        ]
      },
      {
        name: "Gender",
        ids: [
          "domestic-help-personnel-gender"
        ]
      },
      {
        name: "Nationality",
        ids: [
          "domestic-help-personnel-nationality"
        ]
      },
      {
        name: "MaritalStatus",
        ids: [
          "domestic-help-personnel-marital-status"
        ]
      },
      {
        name: "Education",
        ids: [
          "domestic-help-personnel-education"
        ]
      },
      {
        name: "Country",
        ids: [
          "domestic-help-personnel-experience-country"
        ]
      },
      {
        name: "Currency",
        ids: [
          "domestic-help-personnel-salary-currency"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  })
});
