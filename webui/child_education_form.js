
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "ChildEducationSubType",
        ids: [
          "child-education-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "child-education-city"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
