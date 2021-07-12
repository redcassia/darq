
function submitForm() {
  submitAddBusinessForm(
    "addSelfEmployedBusiness",
    "NewSelfEmployedBusinessInput",
    () => {
      return Form.getFormData('self-employed-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "SelfEmployedSubType",
        ids: [
          "self-employed-sub-type"
        ]
      },
      {
        name: "Gender",
        ids: [
          "self-employed-gender"
        ]
      },
      {
        name: "Nationality",
        ids: [
          "self-employed-nationality"
        ]
      },
      {
        name: "City",
        ids: [
          "self-employed-city",
        ]
      },
      {
        name: "Currency",
        ids: [
          "self-employed-charge-currency",
        ]
      },
      {
        name: "Country",
        ids: [
          "self-employed-experience-country"
        ]
      }
    ]);

  });
});
