
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "City",
        ids: [
          "stationery-city"
        ]
      }
    ]);

  });
});
