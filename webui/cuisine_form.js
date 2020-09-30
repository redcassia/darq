
function submitForm() {
  submitAddBusinessForm(
    "addFoodBusiness",
    "NewFoodBusinessInput",
    () => {
      return Form.getFormData('cuisine-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("FoodBusinessSubType", [
      "cuisine-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "cuisine-city"
    ]);
  });
});
