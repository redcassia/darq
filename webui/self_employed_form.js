
function submitForm() {
  var data;

  try {
    data = Form.getFormData('self-employed-form');
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

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("SelfEmployedSubType", [
      "self-employed-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("Gender", [
      "self-employed-gender"
    ]);

    await GraphQL.fillOptionsFromEnum("Nationality", [
      "self-employed-nationality"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "self-employed-city",
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "self-employed-charge-currency",
    ]);

    await GraphQL.fillOptionsFromEnum("Country", [
      "self-employed-experience-country"
    ]);
  });
});
