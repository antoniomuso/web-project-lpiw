function clickSignUp()
{
    document.getElementById("signup-tab").style.backgroundColor = "#EBEBF5";
    document.getElementById("login-tab").style.backgroundColor = "white";
    document.getElementById("form-signup").style.display = "initial";
    document.getElementById("form-login").style.display = "none";
    document.getElementById("login-tab").style.opacity = "0.50";
    document.getElementById("signup-tab").style.opacity = "1";

}
function clickLogin()
{
    document.getElementById("signup-tab").style.backgroundColor = "white";
    document.getElementById("login-tab").style.backgroundColor = "#EBEBF5";
    document.getElementById("form-signup").style.display = "none";
    document.getElementById("form-login").style.display = "initial";
    document.getElementById("login-tab").style.opacity = "1";
    document.getElementById("signup-tab").style.opacity = "0.50";

}
function validateForm()
{

}
$("#email-login").change(validateForm);