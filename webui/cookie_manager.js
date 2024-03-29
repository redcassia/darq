class CookieManager {
  static set(name, value, expiresIn, session) {
    var expires;
    if (expiresIn == 0 && session) {
      expires = "expires=0";
    }
    else {
      var d = new Date();
      d.setTime(d.getTime() + (expiresIn*24*60*60*1000));
      expires = "expires="+ d.toUTCString();
    }
    document.cookie = 
      name + "=" + value + 
      ";" + expires + 
      ";path=" + window.location.pathname +
      ";SameSite=Strict";
  }

  static get(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return null;
  }

  static exists(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return true;
      }
    }

    return false;
  }

  static clear(name) {
    document.cookie =
      name + "=" +
      ";path=" + window.location.pathname +
      "; Max-Age=-99999999";
  }
}
