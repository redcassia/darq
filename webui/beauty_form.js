
function submitForm() {
  var data;

  try {
    data = getFormData('beauty-form');
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: NewBeautyBusinessInput!) {
      addBeautyBusiness(data: $data)
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

  GraphQL.fillOptionsFromEnum("BeautyBusinessSubType", [
    "beauty-sub-type"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "beauty-city"
  ]);
});
