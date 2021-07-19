
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function equals(a, b) {
  if (a === b) {
    return true;
  }
  else if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (! equals(a[i], b[i])) return false;
    }
    return true;
  }
  else if (a instanceof Object && b instanceof Object) {
    for (var key in a) {
      if (
        (b[key] === undefined && a[key] !== undefined) ||
        ! equals(a[key], b[key])
      ) return false;
    }
    for (var key in b) {
      if (
        a[key] === undefined && b[key] !== undefined
      ) return false;
    }
    return true;
  }
  else {
    return false;
  }
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

///////////////////////////////////////////////////////////////////////////////

const BLANKET_FADE_DURATION = 200;

function showBlanket(content, dismissible = true, onDismiss) {
  const blanket = document.getElementById("blanket");

  if (content) {
    blanket.innerHTML = `
      <div id="blanket-content">${content}</div>
    `;
    $("#blanket-content").click(function(e){
      e.stopPropagation();
    });
  }
  else {
    blanket.innerHTML = "";
  }

  if (dismissible) {
    $(blanket).click(function(e) {
      e.stopPropagation();

      hideBlanket();

      if (onDismiss) onDismiss();
    });
  }
  else {
    $("#blanket").click(function(e) { });
  }

  if ($(blanket).is(":hidden")) {
    $(blanket).fadeIn(BLANKET_FADE_DURATION);
  }
}

function hideBlanket() {
  if ($("#blanket").is(":visible")) {
    $("#blanket").fadeOut(BLANKET_FADE_DURATION);
  }
  document.getElementById("blanket").innerHTML = "";
}

///////////////////////////////////////////////////////////////////////////////

const LONG_LOADING_TIME = 50;

var showLoadingBlanketTimer;
function clearLoadingBlanketTimer() {
  if (showLoadingBlanketTimer) {
    clearTimeout(showLoadingBlanketTimer);
    showLoadingBlanketTimer = null;
  }
}

function showLoadingBlanket() {
  showBlanket('<i class="fas fa-sync-alt fa-spin accent" style="font-size: 40px;"></i>', false);
}

function hideLoadingBlanket() {
  clearLoadingBlanketTimer();
  hideBlanket();
}

function __showLoadingBlanketOrRetry() {
  if (inWelcome) {
    clearLoadingBlanketTimer();
    showLoadingBlanketTimer = setTimeout(__showLoadingBlanketOrRetry, LONG_LOADING_TIME);
  }
  else {
    showLoadingBlanket();
  }
}

function showLoadingBlanketIfLongDelay() {
  clearLoadingBlanketTimer();
  showLoadingBlanketTimer = setTimeout(__showLoadingBlanketOrRetry, LONG_LOADING_TIME);
}

async function loadingScreen(func) {
  showLoadingBlanketIfLongDelay();
  await func();
  hideLoadingBlanket();
}

///////////////////////////////////////////////////////////////////////////////

var __alertResolver;

function alert(message) {
  return new Promise((resolve, reject) => {
    __alertResolver = resolve;

    showBlanket(
      `
      <div class="window">
        <div class="h5">${message}</div>
        <br />
        <button class="accent-bg" onclick="hideBlanket(); __alertResolver()">${getString('OK')}</button>
      </div>
      `,
      true,
      () => { resolve(); }
    );
  });
}

function confirm(message) {
  return new Promise((resolve, reject) => {
    __alertResolver = resolve;

    showBlanket(
      `
      <div class="window">
        <div class="h5">${message}</div>
        <br />
        <button onclick="hideBlanket(); __alertResolver(false)">${getString('CANCEL')}</button>
        <button class="accent-bg" onclick="hideBlanket(); __alertResolver(true)">${getString('OK')}</button>
      </div>
      `,
      true,
      () => { resolve(false); }
    );
  });
}

///////////////////////////////////////////////////////////////////////////////

function getString(str) {
  var s = strings[str]
  if (s !== undefined) return s[CookieManager.get("locale")];
  else return str;
}

function getEnumString(name, value) {
  const locale = CookieManager.get("locale");
  if (
    enums[name] !== undefined &&
    enums[name][value] !== undefined &&
    enums[name][value][locale] !== undefined
  ) {
    return enums[name][value][locale];
  }
  else {
    return value;
  }
}
