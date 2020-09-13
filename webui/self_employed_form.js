
function submitForm() {
  var data;

  try {
    data = getFormData('self-employed-form');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: NewSelfEmployedBusinessInput!) {
      addSelfEmployedBusiness(data: $data)
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

  GraphQL.fillOptionsFromEnum("SelfEmployedSubType", [
    "self-employed-sub-type"
  ]);

  GraphQL.fillOptionsFromEnum("Gender", [
    "self-employed-gender"
  ]);

  GraphQL.fillOptionsFromEnum("Nationality", [
    "self-employed-nationality"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "self-employed-city",
  ]);

  GraphQL.fillOptionsFromEnum("Currency", [
    "self-employed-charge-currency",
  ]);

  GraphQL.fillOptionsFromEnum("Country", [
    "self-employed-experience-country"
  ]);
});
