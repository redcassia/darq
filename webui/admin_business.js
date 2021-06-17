var newBusinesses = new Object();
var updatedBusinesses = new Object();

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
      >${b["status"] == 'REJECTED' ? "[REJECTED] - " : ""}${b["display_name"]}</div>
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
      >${b["status"] == 'REJECTED' ? "[REJECTED] - " : ""}${b["display_name"]}</div>
    `);
  }
}

function reviewBusiness(id, approve) {

  var b;
  if (newBusinesses[id]) b = newBusinesses[id];
  else if (updatedBusinesses[id]) b = updatedBusinesses[id];

  var conf = confirm(`
    Are you sure you want to ${approve ? "Approve" : "Reject"} business '${b["display_name"]}'
  `);
  if (! conf) return;

  showLoadingBlanket();

  GraphQL.mutation(`
    mutation ($id: ID!, $approve: Boolean!) {
      reviewBusiness(id: $id, approve: $approve)
    }
  `,{
    id: id,
    approve: approve
  }).then((res) => {
    hideLoadingBlanket();

    if (res.hasError) {
      console.log(res.errors[0]["message"]);
      alert(`Failed to ${approve ? "Approve" : "Reject"} business`);
    }
    else {
      if (approve) {
        if (newBusinesses[id]) delete newBusinesses[id];
        if (updatedBusinesses[id]) delete updatedBusinesses[id];
      }
      else {
        if (newBusinesses[id]) newBusinesses[id]["status"] = 'REJECTED';
        if (updatedBusinesses[id]) updatedBusinesses[id]["status"] = 'REJECTED';
      }

      updateBusinessesMenu();
      document.getElementById("business-content").innerHTML = '';
    }
  }).catch(e => {
    hideLoadingBlanket();

    console.log(e);
    alert("Failed to approve business");
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
      newBusinesses = new Object();;

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
      updatedBusinesses = new Object();;

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
