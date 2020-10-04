var newEvents = new Object();

function updateEventsMenu() {

  var menu = $("#new-events-menu");
  menu.empty();
  for (var id in newEvents) {
    var e = newEvents[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box"
        onclick="loadEvent(${id})"
      >${e["approved"] == 'REJECTED' ? "[REJECTED] - " : ""}${e["display_name"]}</div>
    `);
  }
}

function reviewEvent(id, approve) {

  var conf = confirm(`
    Are you sure you want to ${approve ? "Approve" : "Reject"} event '${newEvents[id]["display_name"]}'
  `);
  if (! conf) return;

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $approve: Boolean!) {
      reviewEvent(id: $id, approve: $approve)
    }
  `,{
    id: id,
    approve: approve
  }).then((res) => {
    $("#loading-blanket").hide();

    if (res.hasError) {
      
      alert(`Failed to ${approve ? "Approve" : "Reject"} event`);
    }
    else {
      if (approve) {
        delete newEvents[id];
      }
      else {
        newEvents[id]["approved"] = 'REJECTED';
      }

      updateEventsMenu();
      document.getElementById("event-content").innerHTML = '';
    }
  }).catch(e => {
    $("#loading-blanket").hide();

    console.log(e);
    alert("Failed to approve event");
  });
}

function loadEvent(id) {

  var html;
  if (newEvents[id]) {
    html = ProfileView.generateEventView(newEvents[id]);
  }
  else {
    throw Error("No such event");
  }

  document.getElementById("event-content").innerHTML = `
    <button onclick="reviewEvent(${id}, true)">Approve</button>
    <button onclick="reviewEvent(${id}, false)" class="accent-bg">Reject</button>
    <br /> <br />
    <div>${html}</div>
  `;

  console.log(`Selected event ${id}`);
}

function queryNewEvents() {
  GraphQL.query(`
    query {
      admin {
        tentativeNewEvents {
          ${_eventQueryFields}
        }
      }
    }
  `).then(res => {
    if (! res.hasError) {
      newEvents = new Object();;

      for (var e of res.data["admin"]["tentativeNewEvents"]) {
        newEvents[e["id"]] = e;
      }

      updateEventsMenu();
    }
  });
}

$(document).ready(queryNewEvents);
