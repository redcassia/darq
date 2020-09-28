
function submitForm() {
  var data;

  try {
    data = Form.getFormData('made-in-qatar-form');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: NewMadeInQatarBusinessInput!) {
      addMadeInQatarBusiness(data: $data)
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
    await GraphQL.fillOptionsFromEnum("MadeInQatarBusinessSubType", [
      "made-in-qatar-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "made-in-qatar-city"
    ]);
  });
});
