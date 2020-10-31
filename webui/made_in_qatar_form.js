
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
    await GraphQL.fillOptionsFromEnum("MadeInQatarBusinessSubType", [
      "made-in-qatar-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "made-in-qatar-city"
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
