var events = new Object();

function updateEventsMenu() {

  var menu;

  menu = $("#events-menu");
  menu.empty();
  for (var id in events) {
    var e = events[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box ${e["status"] == 'DELETED' ? "crossed" : ""}"
        onclick="loadEvent(${e["id"]})"
      >${e["status"] == 'REJECTED' ? `[${getString('REJECTED')}] - ` : ""}${e["display_name"]}</div>
    `);
  }
}

function editEvent(id) {

  DynamicLoader.unloadFrom('event-content');
  DynamicLoader.loadTo(
    'event-content',
    'event_form.html',
    'event_form_update.js',
    [],
    () => {
      initializeForm(events[id]);
      Form.applyEventHandlers();
    }
  );
}

function deleteEvent(id) {
  if (! Form.tryLock()) return;

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($id: ID!) {
      deleteEvent(id: $id)
    }
  `, {
    id: id
  }).then(res => {
    hideLoadingBlanket();
    Form.unlock();

    if (! res.hasError) {
      alert(getString('EVENT_DELETE_SUCCESS_ALERT'));
      queryOwnedEvents();
    }
    else {
      console.log(res.errors[0]["message"]);
      alert(getString('EVENT_DELETE_FAIL_ALERT'));
    }
  }).catch(e => {
    hideLoadingBlanket();
    Form.unlock();

    console.log(e);
    alert(getString('EVENT_DELETE_FAIL_ALERT'));
  });
}

function showDeleteEventConfirmation(id) {
  showBlanket(`
    <div class="window">
      <div class="h5 dark">
        <span class="red">${getString('WARNING')}</span> ${getString('EVENT_DELETE_WARNING')}
        <span class="red">'${events[id]["display_name"]}'</span>
      </div>
      <br />
      <div id="invalid-event-name-confirm" class="h6 red hidden">
        Invalid event name
      </div>
      <input id="event-name-confirm" type="text" />
      <br />
      <button class="red-bg" onclick="
        if ($('#event-name-confirm').val() == '${events[id]["display_name"]}')
          deleteEvent(${id});
        else
          $('#invalid-event-name-confirm').show();
      ">${getString('DELETE')}</button>
    </div>
  `);
}

function loadEvent(id) {

  if (events[id]) {

    var e = events[id];
    var html = `
      <div class="container full-height">
        ${e["status"] == 'DELETED' ? `
          <div class='container-dimmer inside-left-aligned-content'></div>
        ` : ""}

        <div>
          <div class="profile-top-bar-left">
            <div class"h6">
              <span class="accent">${getString('STATUS')}: </span>
              ${getString('EVENT_STATUS')[e["status"]]}
            </div>
          </div><div class="profile-top-bar-right">
            <span title="${getString('EDIT')}" alt="${getString('EDIT')}" class="profile-top-bar-block h6 accent clickable" onclick="editEvent(${id})">
              <i class="fas fa-edit"></i>
            </span>
            <span title="${getString('DELETE')}" alt="${getString('DELETE')}" class="profile-top-bar-block h6 accent clickable " onclick="showDeleteEventConfirmation(${id})">
              <i class="fas fa-trash"></i>
            </span>
          </div>
        </div>

        <br />
        <br />

        ${ProfileView.generateEventView(e)}
      </div>
    `;

    document.getElementById("event-content").innerHTML = html;

    console.log(`Selected event ${id}`);
  }
}

function queryOwnedEvents() {

  DynamicLoader.unloadFrom('event-content');
  window.location.hash = window.location.hash.split('&')[0];

  loadingScreen(async () => {
    var res = await GraphQL.query(`
      query {
        user {
          owned_events {
            ${_eventQueryFields}
          }
        }
      }
    `);

    if (! res.hasError) {
      events = new Object();;

      for (var e of res.data["user"]["owned_events"]) {
        events[e["id"]] = e;
      }

      updateEventsMenu();

      if (res.data["user"]["owned_events"].length > 0) {
        $("#owned-events").show();
      }
      else {
        $("#owned-events").hide();
      }
    }
  });
}

var formLoadOnComplete;
function showCreateForm(onComplete) {
  formLoadOnComplete = onComplete;

  DynamicLoader.unloadFrom('event-content');
  DynamicLoader.loadTo(
    'event-content',
    'event_form.html',
    'event_form.js',
    [],
    () => {
      var hash = window.location.hash.split('&');
      hash[1] = 'event_form';
      window.location.hash = hash.join('&');
      Form.applyEventHandlers();
    }
);
}

$(document).ready(queryOwnedEvents);
