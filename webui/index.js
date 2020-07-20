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

    $("form").submit(function(e) {
        e.preventDefault();
    });

    $(".img-input").click(function() {
        $(this).children()[0].click();
    });
    $(".img-input > input").change(function() {
        var input = $(this);
        if (input.get()[0].files) {
            for (file of input.get()[0].files) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                    var div = document.createElement("div");
                    div.setAttribute('class', 'img-upload-obj');
                    div.setAttribute('data-file', file);
    
                    var img = document.createElement("img");
                    img.setAttribute('src', e.target.result);
    
                    var btn = document.createElement("button");
                    btn.onclick = function() {
                        div.remove();
                    }
    
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
        }
    });

    $(".multiform > button").click(function() {
        $(this).parent().append($($(this).parent().children('.template')[0]).clone().removeClass("template"));

        $(".remove-btn").click(function() {
            this.parentElement.remove();
        });
    });

}

var loadedScripts = []
function addScript(src) {
    if (loadedScripts.indexOf(src) == -1) {
        loadedScripts.push(src);

        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.body.appendChild(s);
    }
}

function loadContent(target, extraScript = "") {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', target, true);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;
        document.getElementById('content').innerHTML = this.responseText;
        setGlobalEventHandlers();
    };
    xhr.send();

    if (extraScript != "") {
        addScript(extraScript);
    }
}

function clearContent(target, extraScript = "") {
    document.getElementById('content').innerHTML = '';

    if (extraScript != "") {
        addScript(extraScript);
    }
}

$(document).ready(function() {
    var hash = window.location.hash;
    if (hash == '#resetpwd') {
        $("#reset-password-form").show();
        welcomeToSignin(0);
    }
    else if (false) {        // TODO: check signed in
        $("#signin-screen").hide();
        $("#signup-screen").hide();
        welcomeToDarQ(400);
    }
    else {
        $("#signin-form").show();
        welcomeToSignin(200);
    }

    setGlobalEventHandlers();

    loadContent('welcome.html', '');
});

function signup() {
    // TODO: signup api call
    alert("Account created successfully.");
}

function signin() {
    // TODO: signin api call
    switchToWelcome();
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

function navigateTo(btn, content) {
    $(".side-bar").children().removeClass("active");
    if (btn) btn.addClass("active");
    $(".side-bar").children().trigger("classChange");

    switch(content) {
        case 'messages':    loadContent('messages.html', ''); break;
        case 'business':    loadContent('add_business.html', 'add_business.js'); break;
        case 'event':       loadContent('create_event.html', 'create_event.js'); break;
        case 'payment':     loadContent('payment.html', ''); break;
        default: clearContent();
    }
}
