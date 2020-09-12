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
