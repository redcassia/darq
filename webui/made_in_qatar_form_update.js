
var initialData;

function submitForm() {
  submitUpdateBusinessForm(
    "updateMadeInQatarBusiness",
    "UpdateMadeInQatarBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('made-in-qatar-form');
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
        name: "MadeInQatarBusinessSubType",
        ids: [
        "made-in-qatar-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "made-in-qatar-city"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["madeInQatarSubType"];
    initialData = data;
    Form.putFormData('made-in-qatar-form', data);
  });
}
