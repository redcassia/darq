
function submitForm() {
  submitAddBusinessForm(
    "addCleaningAndMaintenanceBusiness",
    "NewCleaningAndMaintenanceBusinessInput",
    () => {
      return Form.getFormData('cleaning-maintenance-form');
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("CleaningAndMaintenanceBusinessSubType", [
      "cleaning-maintenance-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "cleaning-maintenance-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "cleaning-maintenance-fees-currency"
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
