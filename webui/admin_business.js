var newBusinesses = {}
var updatedBusinesses = {}

function updateBusinessesMenu() {

  var menu;

  menu = $("#new-businesses-menu");
  menu.empty();
  for (var id in newBusinesses) {
    var b = newBusinesses[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box"
        onclick="loadBusiness(${id})"
      >${b["approved"] == 'REJECTED' ? "[REJECTED] - " : ""}${b["display_name"]}</div>
    `);
  }

  menu = $("#updated-businesses-menu");
  menu.empty();
  for (var id in updatedBusinesses) {
    var b = updatedBusinesses[id];
    menu.append(`
      <div
        class="content-submenu-clickable-box"
        onclick="loadBusiness(${id})"
      >${b["approved"] == 'REJECTED' ? "[REJECTED] - " : ""}${b["display_name"]}</div>
    `);
  }
}

function reviewBusiness(id, approve) {

  var conf = confirm(`
    Are you sure you want to ${approve ? "Approve" : "Reject"} business '${newBusinesses[id]["display_name"]}'
  `);
  if (! conf) return;

  $("#loading-blanket").show();

  GraphQL.mutation(`
    mutation ($id: ID!, $approve: Boolean!) {
      reviewBusiness(id: $id, approve: $approve)
    }
  `,{
    id: id,
    approve: approve
  }).then((res) => {
    $("#loading-blanket").hide();

    if (res.hasError) {
      alert(`Failed to ${approve ? "Approve" : "Reject"} business`);
    }
    else {
      if (approve) {
        if (newBusinesses[id]) delete newBusinesses[id];
        else if (updatedBusinesses[id]) delete updatedBusinesses[id];
      }
      else {
        if (newBusinesses[id]) newBusinesses[id]["approved"] = 'REJECTED';
        else if (updatedBusinesses[id]) updatedBusinesses[id]["approved"] = 'REJECTED';
      }

      updateBusinessesMenu();
      document.getElementById("business-content").innerHTML = '';
    }
  });
}

function loadBusiness(id) {

  var html;
  if (newBusinesses[id]) {
    html = ProfileView.generateBusinessView(newBusinesses[id]);
  }
  else if (updatedBusinesses[id]){
    html = ProfileView.generateBusinessView(updatedBusinesses[id]);
  }
  else {
    throw Error("No such business");
  }

  document.getElementById("business-content").innerHTML = `
    <button onclick="reviewBusiness(${id}, true)">Approve</button>
    <button onclick="reviewBusiness(${id}, false)" class="accent-bg">Reject</button>
    <br /> <br />
    <div>${html}</div>
  `;

  console.log(`Selected business ${id}`);
}

function queryNewBusinesses() {
  GraphQL.query(`
    query {
      admin {
        tentativeNewBusinesses {
          ${_businessQueryFields}
        }
      }
    }
  `).then(res => {
    if (! res.hasError) {
      newBusinesses = {};

      for (var b of res.data["admin"]["tentativeNewBusinesses"]) {
        newBusinesses[b["id"]] = b;
      }

      updateBusinessesMenu();
    }
  });
}

function queryUpdatedBusinesses() {
  GraphQL.query(`
    query {
      admin {
        tentativeBusinessUpdates {
          ${_businessQueryFields}
        }
      }
    }
  `).then(res => {
    if (! res.hasError) {
      updatedBusinesses = {};

      for (var b of res.data["admin"]["tentativeBusinessUpdates"]) {
        updatedBusinesses[b["id"]] = b;
      }

      updateBusinessesMenu();
    }
  });
}

$(document).ready(() => {
  queryNewBusinesses();
  queryUpdatedBusinesses();
});
