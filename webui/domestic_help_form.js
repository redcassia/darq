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
