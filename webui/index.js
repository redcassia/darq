const slideDisplacement = $("#signin-screen > .inactive-home-pane").offset().left;
const slideSpeed = 150;

const welcomeSpeed = 200;

function switchToSignup() {
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
