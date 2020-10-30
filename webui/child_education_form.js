
function submitForm() {
  submitAddBusinessForm(
    "addChildEducationBusiness",
    "NewChildEducationBusinessInput",
    () => {
      return Form.getFormData('child-education-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("ChildEducationSubType", [
      "child-education-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "child-education-city"
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
