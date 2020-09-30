
function submitForm() {
  submitAddBusinessForm(
    "addSportsBusiness",
    "NewSportsBusinessInput",
    () => {
      var data = Form.getFormData('gym-form');
      data["sub_type"] = 'GYM';
      return data;
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("City", [
      "gym-city"
    ]);
  });
});
