
var initialData;

function splitAndRemoveRedundantPersonnel(initialData, data) {
  if (data["personnel"]) {
    data["old_personnel"] = [];

    // find the unchanged personnel and put their name in old_personnel
    data["personnel"].forEach(_ => {
      if (initialData["personnel"].findIndex(p => {
        if (p["name"] != _["name"]) return false;
        for (var key in p) {
          if (!equals(p[key], _[key])) return false;
        }
        for (var key in _) {
          if (!equals(_[key], p[key])) return false;
        }
        return true;
      }) != -1) {
        data["old_personnel"].push(_["name"]);
      }
    });

    // remove the unchanged personnel from personnel
    data["old_personnel"].forEach(name => {
      const index = data["personnel"].findIndex(_ => _["name"] == name);
      if (index != -1) data["personnel"].splice(index, 1);
    });

    // dedupe changed personnel data and split the attachments
    for (var i = 0; i < data["personnel"].length; ++i) {
      var initial = initialData["personnel"].find(_ =>
        _["name"] == data["personnel"][i]["name"]
      );

      if (initial) {
        data["personnel"][i] = Form.removeRedundancy(
          initial,
          data["personnel"][i]
        );

        data["personnel"][i] = Form.splitAttachments(
          data["personnel"][i],
          'old_attachments',
          'attachments'
        );

        data["personnel"][i]["name"] = initial["name"];
      }
    }

    if (data["personnel"].length == 0) {
      delete data["personnel"];
    }

    if (data["old_personnel"].length == initialData["personnel"].length) {
      delete data["old_personnel"];
    }
  }

  return data;
}

function submitForm() {
  submitUpdateBusinessForm(
    "updateDomesticHelpBusiness",
    "UpdateDomesticHelpBusinessInput",
    initialData["id"],
    () => {
      var data = Form.getFormData('domestic-help-form');
      data = Form.removeRedundancy(initialData, data);
      data = Form.splitAttachments(data, 'old_attachments', 'attachments');
      data = splitAndRemoveRedundantPersonnel(initialData, data);
      return data;
    }
  );
}

function updateProfessionRelevantFields(val, node) {

  for (var line of node.children) {
    if (line.classList.contains('form-line') && line.attributes['data-show-with']) {
      var show = line.attributes['data-show-with'].value;
      if (show.indexOf(val) != -1) {
        $(line).removeClass("hidden");
        Form.setRequired(line, true);
      }
      else {
        $(line).addClass("hidden");
        Form.setRequired(line, false);
      }
    }
  }
}

function initializeForm(data) {

  loadingScreen(async () => {
    await GraphQL.fillOptionsFromEnum([
      {
        name: "DomesticHelpSubType",
        ids: [
          "domestic-help-sub-type"
        ]
      },
      {
        name: "City",
        ids: [
          "domestic-help-city"
        ]
      },
      {
        name: "Profession",
        ids: [
          "domestic-help-personnel-profession"
        ]
      },
      {
        name: "Gender",
        ids: [
          "domestic-help-personnel-gender"
        ]
      },
      {
        name: "Nationality",
        ids: [
          "domestic-help-personnel-nationality"
        ]
      },
      {
        name: "MaritalStatus",
        ids: [
          "domestic-help-personnel-marital-status"
        ]
      },
      {
        name: "Education",
        ids: [
          "domestic-help-personnel-education"
        ]
      },
      {
        name: "Country",
        ids: [
          "domestic-help-personnel-experience-country"
        ]
      },
      {
        name: "Currency",
        ids: [
          "domestic-help-personnel-salary-currency"
        ]
      }
    ]);

    if (data["update"]) data = data["update"];
    data["sub_type"] = data["domesticHelpSubType"];
    initialData = data;
    Form.putFormData('domestic-help-form', data);
  });
}
