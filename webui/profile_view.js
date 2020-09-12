class ProfileView {

  static chippedText(title, data) {
    var html = "";
    html += `<div class="profile-big-text">${title}:<div>`;

    for (var x of data) {
      html += `<div class="profile-text-chip">${x}</div>`;
    }

    html += `</div></div>`;

    return html;
  }

  static experience(data) {
    var html = "";

    html += `<div class="profile-experience">
      <div class="profile-experience-left profile-big-text">Experience:</div>
      <div class="profile-experience-right">
    `;

    for (var e of data) {
      html += `
        <div class="profile-medium-text">${e["country"]}${e["institution"] ? ` - ${e["institution"]}` : ""}</div>
        <div class="profile-small-text-light">${e["from"]} - ${e["in_position"] ? "Present" : `${e["to"]}`}</div>
        <br />
      `;
    }

    html += `</div></div>`;

    return html;
  }

  static price(title, data, trailing = "") {
    if (data["value"]) {
      return `
        <div class="profile-big-text">
          ${title}:
          <span class="profile-small-text">
            ${data["value"]} ${data["currency"]} ${trailing}
          </span>
        </div>
      `;
    }
    else {
      return `
        <div class="profile-big-text">
          ${title}:
          <span class="profile-small-text">
            ${data["value_lower"]} : ${data["value_upper"]} ${data["currency"]} ${trailing}
          </span>
        </div>
      `;
    }
  }

  static attachments(title, data) {

    var html = "";

    html += `<div class="profile-big-text">${title}:<br /><br />`;

    for (var picture of data) {
      var url = attachmentsEndpoint + picture;
      html += `
        <img
          class="profile-attachment clickable"
          src="${url}"
          onclick="openInNewTab('${url}')"
        ></img>
      `;
    }

    html += `</div>`;

    return html;
  }

  static generateBusinessView(b) {

    var html = "";

    html += `<div class="profile-left-pane">`;

    html += `
      <div class="profile-left">
        <img
          class="profile-display_picture clickable"
          src="${attachmentsEndpoint}${b["display_picture"]}"
          onclick="openInNewTab('${attachmentsEndpoint}${b["display_picture"]}')"
        ></img>
        <br />
        <br />
        <div class="profile-small-text">
    `;

    if (b["rating"]) {
      var rate = b["rating"];
      for (var i = 0; i < 5; ++i) {
        if (rate >= i + 0.5) {
          if (rate >= i + 1) html += '<i class="fas fa-star accent"></i>';
          else html += '<i class="fas fa-star-half-alt accent"></i>';
        }
        else {
          html += '<i class="far fa-star accent"></i>';
        }
      }
    }
    else {
      html += 'Not yet rated';
    }

    html += `
        </div>
      </div>
      <div class="profile-right">
        <div class="profile-big-text">${b["display_name"]}</div>
        <div class="profile-small-text">${b["sub_type_string"]}</div>
    `;
    if (b["gender"]) {
      html += `<div class="profile-small-text">${b["gender"]}</div>`
    }
    if (b["nationality"]) {
      html += `<div class="profile-small-text">${b["nationality"]}</div>`
    }
    if (b["phone_number"]) {
      html += `
        <div class="profile-small-text">
          <i class="fas fa-phone-alt"></i> ${b["phone_number"]}
        </div>
      `;
    }
    html += `</div>`;

    html += `<br /><br /><br />`;

    if (b["description"]) {
      html += `
        <div class="profile-medium-text">${b["description"]}</div>
        <hr />
      `;
    }

    if (b["skills"] && b["skills"].length > 0) {
      html += this.chippedText("Skills", b["skills"]);
      html += `<hr />`;
    }

    if (b["experience"] && b["experience"].length > 0) {
      html += this.experience(b["experience"]);
      html += `<hr />`;
    }

    if (b["charge"]) {
      html += this.price("Charge", b["charge"], "/ hr");
      html += `<hr />`;
    }

    if (b["government_id"]) {
      html += `
        <div class="profile-big-text">
          Government-issued ID:
          <br /><br />
          <img
            class="profile-attachment clickable"
            src="${attachmentsEndpoint}${b["government_id"]}"
            onclick="openInNewTab('${attachmentsEndpoint}${b["government_id"]}')"
          ></img>
        </div>
      `;
      html += `<hr />`;
    }

    if (b["attachments"] && b["attachments"].length > 0) {
      html += this.attachments("Photos", b["attachments"]);
    }

    html += `</div>`;

    return html;
  }
}
