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

function loadEvent(id) {

  if (events[id]) {
    var html = ProfileView.generateEventView(events[id]);
    document.getElementById("event-view").innerHTML = html;

    $("#create-event-form").hide();
    $("#event-view").show();

    console.log(`Selected event ${id}`);
  }
}

function queryOwnedEvents() {
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
        $("#owned-events").show();
      }
    }
  });

}

function showForm() {
  $("#event-view").hide();
  $("#create-event-form").show();
}

function submitForm(form) {
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
    mutation ($data: NewEventInput!) {
      addEvent(data: $data)
    }
  `, {
    "data": data
  }).then(res => {
    $("#loading-blanket").hide();

    if (! res.hasError) {
      alert("Your event has been added. The data will be reviewed and we will contact you shortly.");
      queryOwnedEvents();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

$(document).ready(function() {
  GraphQL.fillOptionsFromEnum("EventType", [
    "event-type"
  ]);

  GraphQL.fillOptionsFromEnum("City", [
    "event-city"
  ]);

  GraphQL.fillOptionsFromEnum("Currency", [
    "event-ticket-price-currency"
  ]);

  queryOwnedEvents();
});
