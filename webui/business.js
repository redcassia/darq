var businesses = new Object();

function submitAddBusinessForm(mutationName, inputName, getData) {
  if (! Form.tryLock()) return;

  var data;
  try {
    data = getData();
  }
  catch (e) {
    console.log(e);
    Form.unlock();
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($data: ${inputName}!) {
      ${mutationName}(data: $data)
    }
  `, {
    data: data
  }).then(res => {
    $("#loading-blanket").hide();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('BUSINESS_ADD_SUCCESS_ALERT'));
      queryOwnedBusinesses();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('BUSINESS_ADD_FAIL_ALERT'));
    }
  }).catch(e => {
    $("#loading-blanket").hide();
    Form.unlock();

    console.log(e);
    alert(getString('BUSINESS_ADD_FAIL_ALERT'));
  });
}

function submitUpdateBusinessForm(mutationName, inputName, id, getData) {
  if (! Form.tryLock()) return;

  var data;
  try {
    data = getData();
  }
  catch (e) {
    console.log(e);
    Form.unlock();
    return;
  }

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: ${inputName}!) {
      ${mutationName}(id: $id, data: $data)
    }
  `, {
    id: id,
    data: data
  }).then(res => {
    $("#loading-blanket").hide();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('BUSINESS_UPDATE_SUCCESS_ALERT'));
      queryOwnedBusinesses();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('BUSINESS_UPDATE_FAIL_ALERT'));
    }
  }).catch(e => {
    $("#loading-blanket").hide();
    Form.unlock();

    console.log(e);
    alert(getString('BUSINESS_UPDATE_FAIL_ALERT'));
  });
}

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
      >${b["approved"] == 'REJECTED' ? `[${getString('REJECTED')}] - ` : ""}${b["display_name"]}</div>
    `);
  }
}

function editBusiness(id) {

  var formName;
  switch (businesses[id]["type"]) {
    case 'SelfEmployedBusiness':            formName = 'self_employed_form'; break;
    case 'ChildEducationBusiness':          formName = 'child_education_form'; break;
    case 'DomesticHelpBusiness':            formName = 'domestic_help_form'; break;
    case 'BeautyBusiness':                  formName = 'beauty_form'; break;
    case 'TransportationBusiness':          formName = 'transportation_form'; break;
    case 'HospitalityBusiness':             formName = 'hospitality_form'; break;
    case 'StationeryBusiness':              formName = 'stationery_form'; break;
    case 'MadeInQatarBusiness':             formName = 'made_in_qatar_form'; break;
    case 'SportsBusiness':
      if (businesses[id]["sportsSubType"] == 'GYM') {
        formName = 'gym_form';
      }
      else {
        formName = 'club_form';
      }
      break;
    case 'EntertainmentBusiness':           formName = 'entertainment_form'; break;
    case 'FoodBusiness':                    formName = 'cuisine_form'; break;
    case 'CleaningAndMaintenanceBusiness':  formName = 'cleaning_maintenance_form'; break;
  }

  DynamicLoader.unloadFrom('business-content');
  DynamicLoader.loadTo(
    'business-content',
    formName + '.html',
    formName + '_update.js',
    [],
    () => {
      initializeForm(businesses[id]);
      Form.applyEventHandlers();
    }
  );
}

function loadBusiness(id) {

  if (businesses[id]) {
    var b = businesses[id];
    var html = `
      <div class"h6">
        <span class="accent">Status: </span>
        ${getString('BUSINESS_APPROVE_STATUS')[b["approved"]]}
      </div>
    `;

    if (b["update"]) {
      html += `
        <div class"h6">
          <span class="accent">Update status: </span>
          ${getString('BUSINESS_UPDATE_APPROVE_STATUS')[b["update"]["approved"]]}
        </div>
      `;
    }

    html +=`
      <br />
      <div class="h6 clickable underlined" onclick="editBusiness(${id})">
        <i class="fas fa-pencil-alt"></i> ${getString('EDIT')}
      </div>
      <br />
      <br />
      ${ProfileView.generateBusinessView(b)}
    `;

    document.getElementById("business-content").innerHTML = html;

    console.log(`Selected business ${id}`);
  }
}

function queryOwnedBusinesses() {

  DynamicLoader.unloadFrom('business-content');
  window.location.hash = window.location.hash.split('&')[0];

  loadingScreen(async () => {
    var res = await GraphQL.query(`
      query {
        user {
          owned_businesses {
            ${_businessQueryFields}
          }
        }
      }
    `);

    if (! res.hasError) {
      businesses = new Object();;

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

var currentForm;
var formLoadOnComplete;
function loadForm(formName, onComplete) {

  $("#business-type-select").val(formName);

  if (formName.length > 0 && currentForm != formName) {
    currentForm = formName;
    formLoadOnComplete = onComplete;

    DynamicLoader.unloadFrom('business-content');
    DynamicLoader.loadTo(
      'business-content',
      formName + '.html',
      formName + '.js',
      [],
      () => {
        var hash = window.location.hash.split('&');
        hash[1] = formName;
        window.location.hash = hash.join('&');
        Form.applyEventHandlers();
      }
    );
  }
}

$(document).ready(queryOwnedBusinesses);
