
function submitForm() {
  submitAddBusinessForm(
    "addMadeInQatarBusiness",
    "NewMadeInQatarBusinessInput",
    () => {
      return Form.getFormData('made-in-qatar-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "MadeInQatarBusinessSubType",
        ids: [
        "made-in-qatar-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "made-in-qatar-city"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
