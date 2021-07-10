const slideSpeed = 150;
const welcomeSpeed = 150;

function switchLocale(locale) {
  CookieManager.set("locale", locale, 1000);
  $("#welcome-screen").show();
  $("#main-screen").hide();
  $("#welcome-screen > .inactive-home-pane").animate({
    height: '100%',
    width: '100%',
    left: '0'
  }, welcomeSpeed, "easeInQuad", function() {
    location.reload();
  });
}

function switchToForgotPassword() {
  $("#signin-form").animate({
    height: 'toggle'
  }, slideSpeed);
  $("#forgot-password-form").animate({
    height: 'toggle'
  }, slideSpeed);
}

function switchToWelcome() {
  $("#welcome-screen > .active-home-pane").css('width', '55%');
  $("#welcome-screen > .inactive-home-pane").css('width', '45%');

  $("#welcome-screen").show();
  $("#signin-screen").hide();
  $("#signup-screen").hide();

  welcomeToDarQ(0);
}

var inWelcome = true;
function welcomeToDarQ(d) {
  inWelcome = true;
  $("#welcome-screen > .inactive-home-pane").delay(d).animate({
    height: '64px',
    width: '100%',
    left: '0'
  }, welcomeSpeed, "easeInQuad", function() {
    $("#welcome-screen").hide();
    $("#main-screen").show();
    inWelcome = false;
  });
}

function setGlobalEventHandlers() {
}

function loadFirstPage(path) {
  if (path !== undefined && path.length > 0) {
    navigateTo(path, () => { welcomeToDarQ(200); });
  }
  else {
    GraphQL.query(`
      query {
        user {
          owned_businesses {
            id
          }
        }
      }
    `).then(res => {
      if (! res.hasError) {
        businesses = res.data["owned_businesses"];
        if (res.data["user"]["owned_businesses"].length > 0) {
          navigateTo('messages', () => { welcomeToDarQ(200); });
        }
        else {
          navigateTo('welcome', () => { welcomeToDarQ(200); });
        }
      }
    });
  }
}

var resetPwdEmail;
var resetPwdToken;

$(document).ready(function() {

  var hash = window.location.hash.split('&');

  if (hash[0] == '#resetpwd') {
    $("#reset-password-form").show();
    welcomeToSignin(0);
    resetPwdEmail = hash[1].substr(6);
    resetPwdToken = hash[2].substr(6);
  }
  else if (CookieManager.exists('token')) {
    GraphQL.query(`
      query {
        user {
          id
        }
      }
    `).then(res => {
      if (! res.hasError) {
        $("#signin-screen").hide();
        $("#signup-screen").hide();
        var path = hash[0].length > 0 ? hash : undefined;
        if (path !== undefined && path.length > 0) {
          path[0] = path[0].substr(1);
        }
        loadFirstPage(path);
      }
      else {
        $("#signin-form").show();
        welcomeToSignin(200);
      }
    })
  }
  else {
    $("#signin-form").show();
    welcomeToSignin(200);
  }

  setGlobalEventHandlers();
});

function signup() {
  var email = document.getElementById("signup-email").value;
  var pass = document.getElementById("signup-password").value;
  var pass_conf = document.getElementById("signup-password-confirm").value;

  if (! email) {
    alert(getString('MISSING_EMAIL_ALERT'));
    return;
  }

  if (! isValidEmail(email)) {
    alert(getString('INVALID_EMAIL_ALERT'));
    return;
  }

  if (! pass) {
    alert(getString('MISSING_PASSWORD_ALERT'));
    return;
  }

  if (pass.length < 8) {
    alert(getString('SHORT_PASSWORD_ALERT'));
    return;
  }

  if (! pass_conf) {
    alert(getString('MISSING_PASSWORD_CONFIRM_ALERT'));
    return;
  }

  if (pass != pass_conf) {
    alert(getString('MISMATCHING_PASSWORDS_ALERT'));
    return;
  }

  GraphQL.mutation(`
    mutation ($email: String!, $password: String!) {
      createBusinessUser(email: $email, password: $password)
    }
  `, {
    "email": email,
    "password": pass
  }).then(res => {
    if (! res.hasError) {
      alert(getString('SINGUP_SUCCESS_ALERT'));
      switchToSignin();
    }
    else {
      alert(getString(res.errors[0]["extensions"]["code"]));
    }
  });
}

function signin() {
  var email = document.getElementById("signin-email").value;
  var pass = document.getElementById("signin-password").value;

  if (! email) {
    alert(getString('MISSING_EMAIL_ALERT'));
    return;
  }

  if (! pass) {
    alert(getString('MISSING_PASSWORD_ALERT'));
    return;
  }

  GraphQL.mutation(`
    mutation ($email: String!, $password: String!) {
      authenticateBusinessUser(email: $email, password: $password)
    }
  `, {
    "email": email,
    "password": pass
  }).then(res => {
    if (! res.hasError) {
      CookieManager.set('token', res.data["authenticateBusinessUser"], 1);
      loadFirstPage();
      switchToWelcome();
    }
    else {
      alert(getString('SIGNIN_REJECTED_ALERT'));
    }
  });
}
function signout() {
  if (confirm(getString('CONFIRM_LOGOUT'))) {
    CookieManager.clear('token');
    location.reload();
  }
}

function requestPasswordReset() {

  var email = document.getElementById("reset-password-email").value;

  if (! email) {
    alert(getString('MISSING_EMAIL_ALERT'));
    return;
  }

  if (! isValidEmail(email)) {
    alert(getString('INVALID_EMAIL_ALERT'));
    return;
  }

  GraphQL.mutation(`
    mutation($email: String!) {
      requestBusinessUserPasswordReset(email: $email)
    }
  `, {
    email: email
  }).then(res => {
    if (! res.hasError) {
      alert(getString('RESET_PASSWORD_REQUEST_SUCCESS_ALERT'));
    }
    else {
      alert(getString('RESET_PASSWORD_REQUEST_FAIL_ALERT'));
    }
  });
}

function resetPassword() {

  var pass = document.getElementById("reset-password").value;
  var pass_conf = document.getElementById("reset-password-conf").value;

  if (! pass) {
    alert(getString('MISSING_PASSWORD_ALERT'));
    return;
  }

  if (pass.length < 8) {
    alert(getString('SHORT_PASSWORD_ALERT'));
    return;
  }

  if (! pass_conf) {
    alert(getString('MISSING_PASSWORD_CONFIRM_ALERT'));
    return;
  }

  if (pass != pass_conf) {
    alert(getString('MISMATCHING_PASSWORDS_ALERT'));
    return;
  }

  GraphQL.mutation(`
    mutation($email: String!, $token: String!, $newPassword: String!) {
      resetBusinessUserPassword(email: $email, token: $token, newPassword: $newPassword)
    }
  `, {
    email: resetPwdEmail,
    token: resetPwdToken,
    newPassword: pass
  }).then(res => {
    if (! res.hasError) {
      window.location.hash = '';
      CookieManager.set('token', res.data["resetBusinessUserPassword"], 1);
      loadFirstPage();
      switchToWelcome();
    }
    else {
      alert(getString('RESET_PASSWORD_FAIL_ALERT'));
    }
  });
}

function toggleHamburger() {
  $(".side-bar").toggleClass('open');
}

function navigateTo(path, onComplete) {

  if (typeof path == 'string') {
    path = [ path ];
  }

  $(".side-bar").children().removeClass("active");

  DynamicLoader.unloadFrom('content');

  switch(path[0]) {
    case 'welcome':
      DynamicLoader.loadTo('content',
        'welcome.html',
        '',
        [],
        onComplete
      );
      window.location.hash = '#welcome';
      break;

    case 'messages':
      DynamicLoader.loadTo('content',
        'messages.html',
        'messages.js',
        [],
        onComplete
      );
      $('#messages-btn').addClass("active");
      window.location.hash = '#messages';
      break;

    case 'business':
      DynamicLoader.loadTo('content',
        'business.html',
        'business.js',
        [
          {
            src: 'form.js',
            singleLoad: true
          },
          {
            src: 'profile_view.js',
            singleLoad: true
          }
        ],
        () => {
          if (path.length > 1) loadForm(path[1], onComplete);
          else if (onComplete) onComplete();
        }
      );
      $('#business-btn').addClass("active");
      window.location.hash = '#business';
      break;

    case 'event':
      DynamicLoader.loadTo('content',
        'event.html',
        'event.js',
        [
          {
            src: 'form.js',
            singleLoad: true
          },
          {
            src: 'profile_view.js',
            singleLoad: true
          }
        ],
        () => {
          if (path.length > 1 && path[1] == 'event_form') showCreateForm(onComplete);
          else if (onComplete) onComplete();
        }
      );
      $('#events-btn').addClass("active");
      window.location.hash = '#event';
      break;

    case 'settings':
      DynamicLoader.loadTo('content',
        'settings.html',
        'settings.js',
        [
          {
            src: 'form.js',
            singleLoad: true
          }
        ],
        onComplete
      );
      $('#settings-btn').addClass("active");
      window.location.hash = '#settings';
      break;

    default: break;
  }
}
