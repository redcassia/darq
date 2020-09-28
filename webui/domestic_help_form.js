
function submitForm() {
  var data;

  try {
    data = Form.getFormData('domestic-help-form');
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

function updateProfessionRelevantFields(val, node) {

  for (var line of node.children) {
    if (line.classList.contains('form-line') && line.attributes['data-show-with']) {
      var show = line.attributes['data-show-with'].value;
      if (show.indexOf(val) != -1) {
        $(line).show();
        Form.setRequired(line, true);
      }
      else {
        $(line).hide();
        Form.setRequired(line, false);
      }
    }
  }
}

$(document).ready(function () {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum("DomesticHelpSubType", [
      "domestic-help-sub-type"
    ]);

    await GraphQL.fillOptionsFromEnum("City", [
      "domestic-help-city"
    ]);

    await GraphQL.fillOptionsFromEnum("Profession", [
      "domestic-help-personnel-profession"
    ]);

    await GraphQL.fillOptionsFromEnum("Gender", [
      "domestic-help-personnel-gender"
    ]);

    await GraphQL.fillOptionsFromEnum("Nationality", [
      "domestic-help-personnel-nationality"
    ]);

    await GraphQL.fillOptionsFromEnum("MaritalStatus", [
      "domestic-help-personnel-marital-status"
    ]);

    await GraphQL.fillOptionsFromEnum("Education", [
      "domestic-help-personnel-education"
    ]);

    await GraphQL.fillOptionsFromEnum("Country", [
      "domestic-help-personnel-experience-country"
    ]);

    await GraphQL.fillOptionsFromEnum("Currency", [
      "domestic-help-personnel-salary-currency"
    ]);
  })
});
