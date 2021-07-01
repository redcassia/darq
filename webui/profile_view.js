class ProfileView {

  static _chippedText(title, data) {
    var html = "";
    html += `<div class="profile-big-text">${title}:<div>`;

    for (var x of data) {
      if (x.en === undefined) {
        html += `<div class="profile-text-chip">${x}</div>`;
      }
      else {
        html += `<div class="profile-text-chip">${x.en}; ${x.ar}</div>`;
      }
    }

    html += `</div></div>`;

    return html;
  }

  static _itemizedText(title, data) {
    var html = "";
    html += `<div class="profile-big-text">${title}:<div>`;

    for (var x of data) {
      if (x.en === undefined) {
        html += `<div class="profile-small-text-light"> - ${x}</div>`;
      }
      else {
        html += `<div class="profile-small-text-light"> - ${x.en}; ${x.ar}</div>`;
      }
    }

    html += `</div></div>`;

    return html;
  }

  static _text(title, data) {
    if (data.en === undefined) {
      return `
        <div class="profile-big-text">
          ${title}:
          <span class="profile-small-text">${data}</span>
        </div>
      `;
    }
    else {
      return `
        <div class="profile-big-text">
          ${title}:
          <span class="profile-small-text">${data.en}; ${data.ar}</span>
        </div>
      `;
    }
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
      <div class="profile-experience-left profile-big-text">${getString('EXPERIENCE')}:</div>
      <div class="profile-experience-right">
    `;

    for (var e of data) {
      html += `
        <div class="profile-medium-text">${e["country"]}${e["institution"] ? ` - ${e["institution"]}` : ""}</div>
        <div class="profile-small-text-light">${e["from"]} - ${e["in_position"] ? getString('PRESENT') : `${e["to"]}`}</div>
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
            ${data["valueLower"]} - ${data["valueUpper"]} ${data["currency"]} ${trailing}
          </span>
        </div>
      `;
    }
  }

  static _attachments(title, data) {

    var html = "";

    html += `<div class="profile-big-text">${title}:<br /><br />`;

    for (var picture of data) {
      var url = attachmentsEndpoint  + picture;
      html += `
        <img
          class="profile-attachment clickable"
          src="${attachmentsEndpoint}/thumb/${picture}"
          onclick="openInNewTab('${attachmentsEndpoint}/${picture}')"
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
          src="${attachmentsEndpoint}/thumb/${data}"
          onclick="openInNewTab('${attachmentsEndpoint}/${data}')"
        ></img>
      </div>
    `;
  }

  static _personnel(data) {
    var html = "<div>";

    for (var p of data) {
      html += `
        <div class="profile-personnel">
          <br />
          <img
            class="profile-personnel-picture"
            src="${attachmentsEndpoint}/thumb/${p["picture"]}"
          ></img>
          <br />
          <div class="profile-small-text">${p["name"]}</div>
          <div class="profile-small-text-light">${p["nationality"]}</div>
          <div class="profile-small-text-light">${p["profession"]}</div>
        </div>
      `;
    }

    html += "</div>"
    return html;
  }

  static _generateBusinessView(b) {

    var html = `
      <div class="profile-left">
        <img
          class="profile-display_picture clickable"
          src="${attachmentsEndpoint}/thumb/${b["display_picture"]}"
          onclick="openInNewTab('${attachmentsEndpoint}/${b["display_picture"]}')"
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
      html += getString('NOT_RATED');
    }

    html += `
        </div>
      </div>
      <div class="profile-right">
        <div class="profile-big-text">${b["display_name"]}</div>
    `;

    if (b["sub_type_string"]) {
        html += `<div class="profile-small-text">${b["sub_type_string"].en}; ${b["sub_type_string"].ar}</div>`;
    }

    if (b["gender"]) {
      html += `<div class="profile-small-text">${getEnumString("Gender", b["gender"])}</div>`
    }

    if (b["nationality"]) {
      html += `<div class="profile-small-text">${getEnumString("Nationality", b["nationality"])}</div>`
    }

    html += `
      <div class="profile-small-text">
        <i class="fas fa-map-marker-alt"></i>
    `;
    if (b["street_address"]) {
      html += `${b["street_address"]} - `
    }
    html += `${getEnumString("City", b["city"])}, Qatar</div>`

    if (b["operating_hours"]) {
      html += `
        <div class="profile-small-text">
          <i class="far fa-clock"></i>
          ${
            b["operating_hours"]["all_day"] ?
            getString('_24_HRS') :
            `${b["operating_hours"]["open"]} - ${b["operating_hours"]["close"]}`
          }
        </div>
      `;
    }

    if (b["phone_number"]) {
      for (var num of b["phone_number"]) {
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
        <div class="profile-medium-text">${b["description"].en}</div>
        <br>
        <div class="profile-medium-text">${b["description"].ar}</div>
      `;
    }

    if (b["home_service_available"] != null) {
      html += '<hr />' + this._text(
        getString('HOME_SERIVCE'),
        b["home_service_available"] ? getString('AVAILABLE') : getString('NOT_AVAILABLE')
      );
    }

    if (b["home_delivery_available"] != null) {
      html += '<hr />' + this._text(
        getString('HOME_DELIVERY'),
        b["home_delivery_available"] ? getString('AVAILABLE') : getString('NOT_AVAILABLE')
      );
    }

    if (b["home_training_available"] != null) {
      html += '<hr />' + this._text(
        getString('HOME_TRAINING'),
        b["home_training_available"] ? getString('AVAILABLE') : getString('NOT_AVAILABLE')
      );
    }

    if (b["services"] && b["services"].length > 0) {
      html += '<hr />' + this._itemizedText(getString('SERVICES'), b["services"]);
    }

    if (b["products"] && b["products"].length > 0) {
      html += '<hr />' + this._itemizedText(getString('PRODUCTS'), b["products"]);
    }

    if (b["classes"] && b["classes"].length > 0) {
      html += '<hr />' + this._itemizedText(getString('CLASSES'), b["classes"]);
    }

    if (b["teams"] && b["teams"].length > 0) {
      html += '<hr />' + this._itemizedText(getString('TEAMS'), b["teams"]);
    }

    if (b["activities"] && b["activities"].length > 0) {
      html += '<hr />' + this._itemizedText(getString('ACTIVITIES'), b["activities"]);
    }

    if (b["skills"] && b["skills"].length > 0) {
      html += '<hr />' + this._chippedText(getString('SKILLS'), b["skills"]);
    }

    if (b["experience"] && b["experience"].length > 0) {
      html += '<hr />' + this._experience(b["experience"]);
    }

    if (b["charge"]) {
      html += '<hr />' + this._price(getString('CHARGE'), b["charge"], "/ hr");
    }
    if (b["optional_charge"]) {
      html += '<hr />' + this._price(getString('CHARGE'), b["optional_charge"], "/ hr");
    }

    if (b["year_founded"]) {
      html += '<hr />' + this._text(getString('FOUNDED'), b["year_founded"]);
    }

    if (b["curriculum"]) {
      html += '<hr />' + this._itemizedText(getString('CURRICULUM'), b["curriculum"]);
    }

    if (b["government_id"]) {
      html += '<hr />' + this._picture(getString('GOVERNMENT_ISSUED_ID'), b["government_id"]);
    }

    if (b["trade_license"]) {
      html += '<hr />' + this._picture(getString('TRADE_LICENSE'), b["trade_license"]);
    }
    if (b["trade_license_number"]) {
      html += this._text(getString('TRADE_LICENSE_NUMBER'), b["trade_license_number"]);
    }

    if (b["genders"]) {
      html += '<hr />' + this._text(getString('GENDER'), getEnumString("Genders", b["genders"]));
    }

    if (b["website"]) {
      html += '<hr />' + this._link(getString('WEBSITE'), b["website"]);
    }

    if (b["menu"] && b["menu"].length > 0) {
      html += '<hr />' + this._attachments(getString('MENU'), b["menu"]);
    }

    if (b["attachments"] && b["attachments"].length > 0) {
      html += '<hr />' + this._attachments(getString('PHOTOS'), b["attachments"]);
    }

    if (b["personnel"] && b["personnel"].length > 0) {
      html += '<hr />' + this._personnel(b["personnel"]);
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
      var update = b["update"];

      if (update["attachments"] && update["old_attachments"]) {
        update["old_attachments"].forEach(_ => update["attachments"].push(_));
      }
      if (update["menu"] && update["old_menu"]) {
        update["old_menu"].forEach(_ => update["menu"].push(_));
      }

      html += `
        <div class="profile-right-pane">
          ${this._generateBusinessView(update)}
        </div>
      `;
    }

    return html;
  }

  static _generateEventView(e) {

    var html = `
      <div class="profile-left">
        <img
          class="profile-display_picture clickable"
          src="${attachmentsEndpoint}/thumb/${e["display_picture"]}"
          onclick="openInNewTab('${attachmentsEndpoint}/${e["display_picture"]}')"
        ></img>
      </div>
      <div class="profile-right">
        <div class="profile-big-text">${e["display_name"]}</div>
    `;

    if (e["type"]) {
        html += `<div class="profile-small-text">${getEnumString("EventType", e["type"])}</div>`;
    }

    if (e["street_address"] || e["city"]) {
      html += `
        <div class="profile-small-text">
          <i class="fas fa-map-marker-alt"></i>
      `;
      if (e["street_address"]) {
        html += `${e["street_address"]} - `
      }
      if (e["city"]) {
        html += `${getEnumString("City", e["city"])}, Qatar`
      }

      html += `</div>`
    }

    if (e["hours"]) {
      html += `
        <div class="profile-small-text">
          <i class="far fa-clock"></i>
          ${
            e["hours"]["all_day"] ?
            getString('_24_HRS') :
            `${e["hours"]["open"]} - ${e["hours"]["close"]}`
          }
        </div>
      `;
    }

    if (e["phone_number"]) {
      for (var num of e["phone_number"]) {
        html += `
          <div class="profile-small-text">
            <i class="fas fa-phone-alt"></i> ${num}
          </div>
        `;
      }
    }

    html += `</div>`;

    html += `<br /><br /><br />`;

    html += `
      <div class="profile-medium-text">${e["description"].en}</div>
      <br>
      <div class="profile-medium-text">${e["description"].ar}</div>
      <hr />
      <div class="profile-left" style="height: auto; min-height: 0">
        ${this._text(getString('START'), e["duration"]["start"])}
      </div>
      <div class="profile-right">
        ${this._text(getString('END'), e["duration"]["end"])}
      </div>
    `;

    if (e["ticket_website"]) {
      html += '<hr />' + this._link(getString('TICKET_RESERVATION'), e["ticket_website"]);
    }

    if (e["ticket_price"]) {
      html += '<hr />' + this._price(getString('TICKET_PRICE'), e["ticket_price"]);
    }

    if (e["organizer"]) {
      html += '<hr />' + this._text(getString('ORGANIZER'), e["organizer"]);
    }

    if (e["attachments"] && e["attachments"].length > 0) {
      html += '<hr />' + this._attachments(getString('PHOTOS'), e["attachments"]);
    }

    return html;
  }

  static generateEventView(e) {
    var html = `
      <div class="profile-left-pane">
        ${this._generateEventView(e)}
      </div>
    `;

    return html;
  }
}
