class ProfileView {

  static _chippedText(title, data) {
    var html = "";
    html += `<div class="profile-big-text">${title}:<div>`;

    for (var x of data) {
      html += `<div class="profile-text-chip">${x}</div>`;
    }

    html += `</div></div>`;

    return html;
  }

  static _itemizedText(title, data) {
    var html = "";
    html += `<div class="profile-big-text">${title}:<div>`;

    for (var x of data) {
      html += `<div class="profile-small-text-light"> - ${x}</div>`;
    }

    html += `</div></div>`;

    return html;
  }

  static _text(title, data) {
    return `
      <div class="profile-big-text">
        ${title}:
        <span class="profile-small-text">${data}</span>
      </div>
    `
  }

  static _link(title, data) {
    return `
      <div class="profile-big-text">
        ${title}:
        <span class="profile-small-text clickable underlined" onclick="openInNewTab('${data}')">${data}</span>
      </div>
    `
  }

  static _experience(data) {
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

  static _price(title, data, trailing = "") {
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

  static _attachments(title, data) {

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

  static _picture(title, data) {
    return `
      <div class="profile-big-text">
        ${title}:
        <br /><br />
        <img
          class="profile-attachment clickable"
          src="${attachmentsEndpoint}${data}"
          onclick="openInNewTab('${attachmentsEndpoint}${data}')"
        ></img>
      </div>
    `;
  }

  static _generateBusinessView(b) {

    var html = `
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
    `;

    if (b["sub_type_string"]) {
        html += `<div class="profile-small-text">${b["sub_type_string"]}</div>`;
    }

    if (b["gender"]) {
      html += `<div class="profile-small-text">${b["gender"]}</div>`
    }

    if (b["nationality"]) {
      html += `<div class="profile-small-text">${b["nationality"]}</div>`
    }

    html += `
      <div class="profile-small-text">
        <i class="fas fa-map-marker-alt"></i>
    `;
    if (b["street_address"]) {
      html += `${b["street_address"]} - `
    }
    html += `${b["city"]}, Qatar</div>`

    if (b["operating_hours"]) {
      html += `
        <div class="profile-small-text">
          <i class="far fa-clock"></i>
          ${
            b["operating_hours"]["all_day"] ?
            "24 hrs" :
            `${b["operating_hours"]["open"]} - ${b["operating_hours"]["close"]}`
          }
        </div>
      `;
    }

    if (b["phone_number"]) {
      html += `
        <div class="profile-small-text">
          <i class="fas fa-phone-alt"></i> ${b["phone_number"]}
        </div>
      `;
    }
    if (b["phone_numbers"]) {
      for (var num of b["phone_numbers"]) {
        html += `
          <div class="profile-small-text">
            <i class="fas fa-phone-alt"></i> ${num}
          </div>
        `;
      }
    }

    html += `</div>`;

    html += `<br /><br /><br />`;

    if (b["description"]) {
      html += `
        <div class="profile-medium-text">${b["description"]}</div>
      `;
    }

    if (b["home_service_available"] != null) {
      html += '<hr />' + this._text("Home Service", b["home_service_available"] ? "Available" : "Not available");
    }

    if (b["home_delivery_available"] != null) {
      html += '<hr />' + this._text("Home Delivery", b["home_delivery_available"] ? "Available" : "Not available");
    }

    if (b["home_training_available"] != null) {
      html += '<hr />' + this._text("Home Training", b["home_training_available"] ? "Available" : "Not available");
    }

    if (b["services"] && b["services"].length > 0) {
      html += '<hr />' + this._itemizedText("Services", b["services"]);
    }

    if (b["products"] && b["products"].length > 0) {
      html += '<hr />' + this._itemizedText("Products", b["products"]);
    }

    if (b["classes"] && b["classes"].length > 0) {
      html += '<hr />' + this._itemizedText("Classes", b["classes"]);
    }

    if (b["teams"] && b["teams"].length > 0) {
      html += '<hr />' + this._itemizedText("Teams", b["teams"]);
    }

    if (b["activities"] && b["activities"].length > 0) {
      html += '<hr />' + this._itemizedText("Activities", b["activities"]);
    }

    if (b["skills"] && b["skills"].length > 0) {
      html += '<hr />' + this._chippedText("Skills", b["skills"]);
    }

    if (b["experience"] && b["experience"].length > 0) {
      html += '<hr />' + this._experience(b["experience"]);
    }

    if (b["charge"]) {
      html += '<hr />' + this._price("Charge", b["charge"], "/ hr");
    }
    if (b["optional_charge"]) {
      html += '<hr />' + this._price("Charge", b["optional_charge"], "/ hr");
    }

    if (b["year_founded"]) {
      html += '<hr />' + this._text("Founded", b["year_founded"]);
    }

    if (b["curriculum"]) {
      html += '<hr />' + this._text("Curriculum", b["curriculum"].join(', '));
    }

    if (b["government_id"]) {
      html += '<hr />' + this._picture("Government-issued ID", b["government_id"]);
    }

    if (b["trade_license"]) {
      html += '<hr />' + this._picture("Trade license", b["trade_license"]);
    }
    if (b["trade_license_number"]) {
      html += this._text("Trade license number", b["trade_license_number"]);
    }

    if (b["genders"]) {
      html += '<hr />' + this._text("Gender", b["genders"]);
    }

    if (b["website"]) {
      html += '<hr />' + this._link("Website", b["website"]);
    }

    if (b["menu"] && b["menu"].length > 0) {
      html += '<hr />' + this._attachments("Menu", b["menu"]);
    }

    if (b["attachments"] && b["attachments"].length > 0) {
      html += '<hr />' + this._attachments("Photos", b["attachments"]);
    }

    return html;
  }

  static generateBusinessView(b) {

    var html = `
      <div class="profile-left-pane">
        ${this._generateBusinessView(b)}
      </div>
    `;

    if (b["update"]) {
      html += `
        <div class="profile-right-pane">
          ${this._generateBusinessView(b["update"])}
        </div>
      `;
    }

    return html;
  }
}
