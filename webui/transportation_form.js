
function submitForm() {
  submitAddBusinessForm(
    "addTransportationBusiness",
    "NewTransportationBusinessInput",
    () => {
      return Form.getFormData('transportation-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("TransportationBusinessSubType", [
      "transportation-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "transportation-city"
    ]);
  });
});
