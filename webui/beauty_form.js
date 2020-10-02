
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
    await GraphQL.fillOptionsFromEnum("BeautyBusinessSubType", [
      "beauty-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "beauty-city"
    ]);
  });
});
