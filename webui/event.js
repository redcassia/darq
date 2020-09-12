var events = {}

 function loadEvent(id) {

  if (events[id]) {
    var html = ProfileView.generateEventView(events[id]);
    document.getElementById("event-view").innerHTML = html;
    $("#create-event-form").hide();
    $("#event-view").show();

    console.log(`Selected event ${id}`);
  }
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

  GraphQL.query(`
    query {
      user {
        owned_events {
          id
        }
      }
    }
  `).then(res => {

    var businessMenu = $("#events-menu");

    if (! res.hasError) {
      for (var b of res.data["user"]["owned_events"]) {
        businesses[b["id"]] = b;
        businessMenu.append(
          `<div class="content-submenu-clickable-box" onclick="loadEvent(${b["id"]})">${b["display_name"]}</div>`
        );
      }

      if (res.data["user"]["owned_events"].length > 0) {
        $("#owned-events").show();
      }
    }
  });
});

function showForm() {
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
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}
