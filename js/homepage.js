
$(document).ready(() => {
    $("#login-tab").click(showLoginTab);
    $("#signup-tab").click(showSignupTab);
})

function showSignupTab () {
    $("#signup-tab").css("backgroundColor", "#EBEBF5")
    $("#login-tab").css("backgroundColor", "white")
    $("#form-signup").css("display", "inherit")
    $("#form-login").css("display", "none")
    $("#login-tab").css("opacity", "0.50")
    $("#signup-tab").css("opacity", "1")
} 

function showLoginTab () {
    $("#signup-tab").css("backgroundColor", "white")
    $("#login-tab").css("backgroundColor", "#EBEBF5")
    $("#form-signup").css("display", "none")
    $("#form-login").css("display", "inherit")
    $("#login-tab").css("opacity", "1")
    $("#signup-tab").css("opacity", "0.50")
}
