
function submitForm() {
  submitAddBusinessForm(
    "addStationeryBusiness",
    "NewStationeryBusinessInput",
    () => {
      return Form.getFormData('stationery-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("City", [
      "stationery-city"
    ]);
  });
});
