const slideSpeed = 150;
const welcomeSpeed = 200;

function switchToSignup() {
  const slideDisplacement = $("#signin-screen > .inactive-home-pane").offset().left;

  $(".inactive-home-pane > .home-pane-content").hide();
  $("#signin-form").hide();
  $("#forgot-password-form").hide();
  $("#reset-password-form").hide();

  $("#signup-form").css({
    left: '-100%'
  }).animate({
    left: '50%'
  }, slideSpeed);
  $("#signin-screen > .inactive-home-pane").animate({
    left: '-=' + slideDisplacement + 'px'
  }, slideSpeed, function() {
    $("#signup-screen").css('z-index', '1');
    $("#signin-screen").css('z-index', '0');
    $(".inactive-home-pane > .home-pane-content").show();
    $("#signin-form").show();
    $(this).css({
      left: '0px'
    })
  });
}

function switchToSignin() {
  const slideDisplacement = $("#signin-screen > .inactive-home-pane").offset().left;

  $(".inactive-home-pane > .home-pane-content").hide();
  $("#signup-form").hide();

  $("#signin-form").css({
    left: '200%'
  }).animate({
    left: '50%'
  }, slideSpeed);
  $("#signup-screen > .inactive-home-pane").animate({
    left: '+=' + slideDisplacement + 'px'
  }, slideSpeed, function() {
    $("#signin-screen").css('z-index', '1');
    $("#signup-screen").css('z-index', '0');
    $(".inactive-home-pane > .home-pane-content").show();
    $("#signup-form").show();
    $(this).css({
      left: '0px'
    })
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

function welcomeToDarQ(d) {
  $("#welcome-screen > .inactive-home-pane").delay(d).animate({
    height: '64px',
    width: '100%',
    left: '0'
  }, welcomeSpeed, "easeInQuad", function() {
    $("#welcome-screen").hide();
    $("#main-screen").show();
  });
}

function welcomeToSignin(d) {
  $("#welcome-screen > .inactive-home-pane").delay(d).animate({
    width: '45%',
    left: '55%'
  }, welcomeSpeed, "easeInQuad", function() {
    $("#welcome-screen").hide();
  });
}

function setGlobalEventHandlers() {
  // change the side bar icons to darker versions when 'active' class changes
  $(".side-bar-btn").on('classChange', function() {
    var icon = $(this).children('img');
    if ($(this).hasClass('active')) {
      icon.attr('src', "assets/" + icon.attr('data-icon-name') + "-icon-dark.png");
    }
    else {
      icon.attr('src', "assets/" + icon.attr('data-icon-name') + "-icon.png");
    }
  });
}

function loadFirstPage() {
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
        navigateTo('messages');
      }
      else {
        navigateTo('welcome');
      }
    }
  });
}

$(document).ready(function() {

  var hash = window.location.hash;

  if (hash == '#resetpwd') {
    $("#reset-password-form").show();
    welcomeToSignin(0);
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
        loadFirstPage();
        welcomeToDarQ(400);
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
    alert("Please enter your email");
    return;
  }

  if (! isValidEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (! pass) {
    alert("Please enter your password");
    return;
  }

  if (pass.length < 8) {
    alert("Your password must be 8 characters or more");
    return;
  }

  if (! pass_conf) {
    alert("Please confirm your password");
    return;
  }

  if (pass != pass_conf) {
    alert("Passwords do not match");
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
      alert("Your account has been created. Please check your inbox to activate your account.");
      switchToSignin();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

function signin() {
  var email = document.getElementById("signin-email").value;
  var pass = document.getElementById("signin-password").value;

  if (! email) {
    alert("Please enter your email");
    return;
  }

  if (! pass) {
    alert("Please enter your password");
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
      alert(res.errors[0]["message"]);
    }
  });
}
function signout() {
  if (confirm("Are you sure you want to Logout?")) {
    CookieManager.clear('token');
    location.reload();
  }
}

function requestPasswordReset() {
  // TODO: request password reset api call
  alert("Please check your email.");
}

function resetPassword() {
  // TODO: reset password api call
  $("#signin-form").animate({
    height: 'toggle'
  }, slideSpeed);
  $("#reset-password-form").animate({
    height: 'toggle'
  }, slideSpeed);
}

function toggleHamburger() {
  $(".side-bar").toggleClass('open');
}

function navigateTo(content) {
  $(".side-bar").children().removeClass("active");

  DynamicLoader.unloadFrom('content');

  switch(content) {
    case 'welcome':
      DynamicLoader.loadTo('content',
        'welcome.html'
      );
      break;

    case 'messages':
      DynamicLoader.loadTo('content',
        'messages.html',
        'messages.js'
      );
      $('#messages-btn').addClass("active");
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
        ]
      );
      $('#business-btn').addClass("active");
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
        ]
      );
      $('#events-btn').addClass("active");
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
        ]
      );
      $('#settings-btn').addClass("active");
      break;

    default: break;
  }

  $(".side-bar").children().trigger("classChange");
}
