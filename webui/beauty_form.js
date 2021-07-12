
function submitForm() {
  submitAddBusinessForm(
    "addBeautyBusiness",
    "NewBeautyBusinessInput",
    () => {
      return Form.getFormData('beauty-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "BeautyBusinessSubType",
        ids: [
          "beauty-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "beauty-city"
        ]
      }
    ]);

  });
});
