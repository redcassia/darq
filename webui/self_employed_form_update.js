
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateSelfEmployedBusiness",
    "UpdateSelfEmployedBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('self-employed-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      return data;
    }
  );
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "SelfEmployedSubType",
        ids: [
          "self-employed-sub-type"
        ]
      },
      {
        name: "Gender",
        ids: [
          "self-employed-gender"
        ]
      },
      {
        name: "Nationality",
        ids: [
          "self-employed-nationality"
        ]
      },
      {
        name: "City",
        ids: [
          "self-employed-city",
        ]
      },
      {
        name: "Currency",
        ids: [
          "self-employed-charge-currency",
        ]
      },
      {
        name: "Country",
        ids: [
          "self-employed-experience-country"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["selfEmployedSubType"];
    initialData = data;
    Form.putFormData('self-employed-form', data);
  });
}
