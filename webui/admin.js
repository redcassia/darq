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

  $("form").submit(function(e) {
    e.preventDefault();
  });

  $(".img-input").click(function() {
    $(this).children()[0].click();
  });
  $(".img-input > input").change(function() {
    var inp = this;
    var input = $(this);
    if (input.get()[0].files) {
      for (file of input.get()[0].files) {
        var reader = new FileReader();
  
        reader.onload = function(e) {
          var div = document.createElement("div");
          div.setAttribute('class', 'img-upload-obj');
  
          var img = document.createElement("img");
          img.setAttribute('src', e.target.result);
  
          var btn = document.createElement("button");
          btn.onclick = function() {
            div.remove();
          }
  
          var cloned = inp.cloneNode();
          cloned.setAttribute('class', 'hidden');
          div.appendChild(cloned);
          div.appendChild(img);
          div.appendChild(btn);
  
          var parent = input.parent();
          if (! parent.hasClass('multiple')) {
            parent.parent().children(".img-upload-obj").remove();
          }
          parent.before(div);
        };
  
        reader.readAsDataURL(file);
      }
    }
  });

  $(".multistring-input > button").click(function() {
    var input = $(this).parent().children('input')[0];
    var val = input.value;

    if (val.length > 0) {
      var div = document.createElement("div");
      div.setAttribute('class', 'string-obj');
      div.setAttribute('data-string', val);
  
      var p = document.createElement("p");
      p.textContent = val;
  
      var btn = document.createElement("button");
      btn.setAttribute('class', 'remove-btn');
      btn.onclick = function() {
        div.remove();
      }
  
      div.appendChild(p);
      div.appendChild(btn);

      $(this).parent().children('div')[0].append(div);
      input.value = "";
    }
  });

  $(".multiform > button").click(function() {
    $(this).parent().append(
      $($(this).parent().children('.template')[0])
        .clone()
        .removeClass("template")
        .addClass("sub-form")
    );

    $(".remove-btn").click(function() {
      this.parentElement.remove();
    });
  });

  $("select").change(function() {
    var next = $(this).next();
    if (next.hasClass('show-when-other')) {
      if ($(this).val() == 'OTHER') next.show();
      else next.hide();
    }
  })
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
function signout() {
  CookieManager.clear('token');
  location.reload();
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
