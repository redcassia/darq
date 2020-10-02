
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
  });
});
