
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
    await GraphQL.fillOptionsFromEnum("HospitalityBusinessSubType", [
      "hospitality-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "hospitality-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "hospitality-fees-currency"
    ]);
  });
});
