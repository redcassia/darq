
function submitForm() {
  submitAddBusinessForm(
    "addEntertainmentBusiness",
    "NewEntertainmentBusinessInput",
    () => {
      return Form.getFormData('entertainment-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "EntertainmentBusinessSubType",
        ids: [
          "entertainment-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "entertainment-city"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
