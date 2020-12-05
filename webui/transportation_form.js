
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "TransportationBusinessSubType",
        ids: [
          "transportation-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "transportation-city"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
