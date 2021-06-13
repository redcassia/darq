
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateHospitalityBusiness",
    "UpdateHospitalityBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('hospitality-form');
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
        name: "HospitalityBusinessSubType",
        ids: [
          "hospitality-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "hospitality-city"
        ]
      },
      {
        name: "Currency",
        ids: [
          "hospitality-fees-currency"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["hospitalitySubType"];
    initialData = data;
    Form.putFormData('hospitality-form', data);
  });
}
