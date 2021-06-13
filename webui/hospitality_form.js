
function submitForm() {
  submitAddBusinessForm(
    "addHospitalityBusiness",
    "NewHospitalityBusinessInput",
    () => {
      return Form.getFormData('hospitality-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "HospitalityBusinessSubType",
        ids: [
          "hospitality-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "hospitality-city"
        ]
      },
      {
        name: "Currency",
        ids: [
          "hospitality-fees-currency"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
