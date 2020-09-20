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
      >${e["approved"] == 'REJECTED' ? "[REJECTED] - " : ""}${e["display_name"]}</div>
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
    }
  );
}

function loadEvent(id) {

  if (events[id]) {

    var e = events[id];
    var html = `
      <div class"h6">
        <span class="accent">Status: </span>
        Approved
      </div>
      <br />
      <div class="h6 clickable underlined" onclick="editEvent(${id})">
        <i class="fas fa-pencil-alt"></i> Edit
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
  var showLoadingScreen = setTimeout(() => $("#loading-blanket").show(), 50);

  DynamicLoader.unloadFrom('business-content');

  GraphQL.query(`
    query {
      user {
        owned_events {
          ${_eventQueryFields}
        }
      }
    }
  `).then(res => {

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

    clearTimeout(showLoadingScreen);
    $("#loading-blanket").hide();
  });
}

function showCreateForm() {
  DynamicLoader.unloadFrom('event-content');
  DynamicLoader.loadTo(
    'event-content',
    'event_form.html',
    'event_form.js'
  );
}

$(document).ready(queryOwnedEvents);
