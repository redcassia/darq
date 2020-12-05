
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "FoodBusinessSubType",
        ids: [
          "cuisine-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "cuisine-city"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
