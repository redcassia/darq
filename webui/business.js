var businesses = {}

function updateBusinessesMenu() {

  var menu;

  menu = $("#businesses-menu");
  menu.empty();
  for (var id in businesses) {
    var b = businesses[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box"
        onclick="loadBusiness(${id})"
      >${b["approved"] == 'REJECTED' ? "[REJECTED] - " : ""}${b["display_name"]}</div>
    `);
  }
}

function loadBusiness(id) {

  if (businesses[id]) {
    var html = ProfileView.generateBusinessView(businesses[id]);
    document.getElementById("business-content").innerHTML = html;

    console.log(`Selected business ${id}`);
  }
}

function queryOwnedBusinesses() {
  GraphQL.query(`
    query {
      user {
        owned_businesses {
          ${_businessQueryFields}
        }
      }
    }
  `).then(res => {

    if (! res.hasError) {
      businesses = {};

      for (var b of res.data["user"]["owned_businesses"]) {
        businesses[b["id"]] = b;
      }

      updateBusinessesMenu();

      if (res.data["user"]["owned_businesses"].length > 0) {
        $("#owned-businesses").show();
      }
      else {
        $("#owned-businesses").hide();
      }
    }
  });
}

function loadForm(formName) {
  DynamicLoader.unloadFrom('business-content');
  DynamicLoader.loadTo('business-content', formName + '.html', formName + ".js");
}

function submitForm(form, businessName) {
  var data;

  try {
    data = getFormData(form);
  }
  catch (e) {
    console.log(e);
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: New${businessName}Input!) {
      add${businessName}(data: $data)
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

$(document).ready(queryOwnedBusinesses);
