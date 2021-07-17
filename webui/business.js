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

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($data: ${inputName}!) {
      ${mutationName}(data: $data)
    }
  `, {
    data: data
  }).then(res => {
    hideLoadingBlanket();
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
    hideLoadingBlanket();
    Form.unlock();

    console.log(e);
    alert(getString('BUSINESS_ADD_FAIL_ALERT'));

    window.location.hash =  window.location.hash.split('&')[0];
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

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($id: ID!, $data: ${inputName}!) {
      ${mutationName}(id: $id, data: $data)
    }
  `, {
    id: id,
    data: data
  }).then(res => {
    hideLoadingBlanket();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('BUSINESS_UPDATE_SUCCESS_ALERT'));
      queryOwnedBusinesses();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('BUSINESS_UPDATE_FAIL_ALERT'));
    }

    window.location.hash =  window.location.hash.split('&')[0];
  }).catch(e => {
    hideLoadingBlanket();
    Form.unlock();

    console.log(e);
    alert(getString('BUSINESS_UPDATE_FAIL_ALERT'));

    window.location.hash =  window.location.hash.split('&')[0];
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
        class="content-submenu-clickable-box ${b["status"] == 'DELETED' ? "crossed" : ""}"
        onclick="loadBusiness(${id})"
      >${b["status"] == 'REJECTED' ? `[${getString('REJECTED')}] - ` : ""}${b["display_name"]}</div>
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

function deleteBusiness(id) {
  if (! Form.tryLock()) return;

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($id: ID!) {
      deleteBusiness(id: $id)
    }
  `, {
    id: id
  }).then(res => {
    hideLoadingBlanket();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('BUSINESS_DELETE_SUCCESS_ALERT'));
      queryOwnedBusinesses();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('BUSINESS_DELETE_FAIL_ALERT'));
    }
  }).catch(e => {
    hideLoadingBlanket();
    Form.unlock();

    console.log(e);
    alert(getString('BUSINESS_DELETE_FAIL_ALERT'));
  });
}

function showDeleteBusinessConfirmation(id) {
  showBlanket(`
    <div class="window">
      <div class="h5">
        <span class="red">${getString('WARNING')}</span> ${getString('BUSINESS_DELETE_WARNING')}
        <span class="red">'${businesses[id]["display_name"]}'</span>
      </div>
      <br />
      <div id="invalid-business-name-confirm" class="h6 red hidden">
        Invalid business name
      </div>
      <input id="business-name-confirm" type="text" />
      <br />
      <button class="red-bg" onclick="
        if ($('#business-name-confirm').val() == '${businesses[id]["display_name"]}')
          deleteBusiness(${id});
        else
          $('#invalid-business-name-confirm').show();
      ">${getString('DELETE')}</button>
    </div>
  `);
}

function loadBusiness(id) {

  if (businesses[id]) {
    var b = businesses[id];
    var html = `
      <div class="container full-height">
        ${b["status"] == 'DELETED' ? `
          <div class='container-dimmer inside-left-aligned-content'></div>
        ` : ""}

        <div>
          <div class="profile-top-bar-left">
            <div class"h6">
              <span class="accent">${getString('STATUS')}: </span>
              ${getString('BUSINESS_STATUS')[b["status"]]}
            </div>

            ${b["update"] ? `
              <div class"h6">
                <span class="accent">${getString('UPDATE_STATUS')}: </span>
                ${getString('BUSINESS_UPDATE_STATUS')[b["update"]["status"]]}
              </div>
            ` : ""}
          </div><div class="profile-top-bar-right">
            <span title="${getString('EDIT')}" alt="${getString('EDIT')}" class="profile-top-bar-block h6 accent clickable" onclick="editBusiness(${id})">
              <i class="fas fa-edit"></i>
            </span>
            <span title="${getString('DELETE')}" alt="${getString('DELETE')}" class="profile-top-bar-block h6 accent clickable " onclick="showDeleteBusinessConfirmation(${id})">
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>

        <br />
        <br />
        <br />

        ${ProfileView.generateBusinessView(b)}
      </div>
    `;

    window.location.hash =  window.location.hash.split('&')[0];

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
function loadForm(formName, onComplete) {

  $("#business-type-select").val(formName);

  if (formName.length > 0 && currentForm != formName) {
    currentForm = formName;

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
        if (onComplete) onComplete();
      }
    );
  }
}

$(document).ready(queryOwnedBusinesses);
