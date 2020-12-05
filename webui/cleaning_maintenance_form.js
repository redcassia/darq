
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
    await GraphQL.fillOptionsFromEnum([
      {
        name: "CleaningAndMaintenanceBusinessSubType",
        ids: [
          "cleaning-maintenance-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "cleaning-maintenance-city"
        ]
      },
      {
        name: "Currency",
        ids: [
          "cleaning-maintenance-fees-currency"
        ]
      }
    ]);

    if (formLoadOnComplete) formLoadOnComplete();
  });
});
