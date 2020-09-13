
function submitForm() {
  var data;

  try {
    data = getFormData('domestic-help-form');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: NewDomesticHelpBusinessInput!) {
      addDomesticHelpBusiness(data: $data)
    }
  `, {
    "data": data
  }).then(res => {
    $("#loading-blanket").hide();

    if (! res.hasError) {
      alert("Your business has been added. The data will be reviewed and we will contact you shortly.");
      queryOwnedBusinesses();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

$(document).ready(function () {

  GraphQL.fillOptionsFromEnum("DomesticHelpSubType", [
    "domestic-help-sub-type"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "domestic-help-city"
  ]);

  GraphQL.fillOptionsFromEnum("Profession", [
    "domestic-help-personnel-profession"
  ]);

  GraphQL.fillOptionsFromEnum("Gender", [
    "domestic-help-personnel-gender"
  ]);

  GraphQL.fillOptionsFromEnum("MaritalStatus", [
    "domestic-help-personnel-marital-status"
  ]);

  GraphQL.fillOptionsFromEnum("Education", [
    "domestic-help-personnel-education"
  ]);

  GraphQL.fillOptionsFromEnum("Currency", [
    "domestic-help-personnel-salary-currency"
  ]);
});
