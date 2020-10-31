
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
    await GraphQL.fillOptionsFromEnum("EntertainmentBusinessSubType", [
      "entertainment-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "entertainment-city"
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
