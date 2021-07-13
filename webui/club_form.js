
function submitForm() {
  submitAddBusinessForm(
    "addSportsBusiness",
    "NewSportsBusinessInput",
    () => {
      var data = Form.getFormData('club-form');
      data["sub_type"] = 'CLUB';
      return data;
    }
  );
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "City",
        ids: [
          "club-city"
        ]
      }
    ]);

  })
});
