var events = new Object();

function updateEventsMenu() {

  var menu;

  menu = $("#events-menu");
  menu.empty();
  for (var id in events) {
    var e = events[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box"
        onclick="loadEvent(${e["id"]})"
      >${e["approved"] == 'REJECTED' ? `[${getString('REJECTED')}] - ` : ""}${e["display_name"]}</div>
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

function loadEvent(id) {

  if (events[id]) {

    var e = events[id];
    var html = `
      <div class"h6">
        <span class="accent">Status: </span>
        ${getString('EVENT_APPROVE_STATUS')[e["approved"]]}
      </div>
      <br />
      <div class="h6 clickable underlined" onclick="editEvent(${id})">
        <i class="fas fa-pencil-alt"></i> ${getString('EDIT')}
      </div>
      <br />
      <br />
      ${ProfileView.generateEventView(e)}
    `;

    document.getElementById("event-content").innerHTML = html;

    console.log(`Selected event ${id}`);
  }
}

function queryOwnedEvents() {

  loadingScreen(async () => {
    DynamicLoader.unloadFrom('event-content');

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
