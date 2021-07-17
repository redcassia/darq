const slideSpeed = 150;
const welcomeSpeed = 200;

function switchToWelcome() {
  $("#welcome-screen > .active-home-pane").css('width', '55%');
  $("#welcome-screen > .inactive-home-pane").css('width', '45%');

  $("#welcome-screen").show();
  $("#signin-screen").hide();

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

  $("#signin-form").show();
  welcomeToSignin(200);

  setGlobalEventHandlers();
});

function signin() {
  var key = document.getElementById("signin-key").value;

  if (! key) {
    alert("Please enter your admin key");
    return;
  }

  GraphQL.mutation(`
    mutation ($key: String!) {
      authenticateAdmin(key: $key)
    }
  `, {
    key: key
  }).then(res => {
    if (! res.hasError) {
      CookieManager.set('token', res.data["authenticateAdmin"], 0, true);
      navigateTo('business');
      switchToWelcome();
    }
    else {
      alert(res.errors[0]["message"]);
    }
  });
}

async function signout() {
  if (await confirm("Are you sure you want to Logout?")) {
    CookieManager.clear('token');
    location.reload();
  }
}

function toggleHamburger() {
  $(".side-bar").toggleClass('open');
}

function navigateTo(content) {
  $(".side-bar").children().removeClass("active");

  DynamicLoader.unloadFrom('content');

  switch(content) {
    case 'business':
      DynamicLoader.loadTo('content',
        'admin_business.html',
        'admin_business.js',
        [
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
        'admin_event.html',
        'admin_event.js'
      );
      $('#events-btn').addClass("active");
      break;

    default: break;
  }

  $(".side-bar").children().trigger("classChange");
}
