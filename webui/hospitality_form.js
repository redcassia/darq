$(document).ready(function () {

  GraphQL.fillOptionsFromEnum("HospitalityBusinessSubType", [
    "hospitality-sub-type"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "hospitality-city"
  ]);

  GraphQL.fillOptionsFromEnum("Currency", [
    "hospitality-fees-currency"
  ]);
});
