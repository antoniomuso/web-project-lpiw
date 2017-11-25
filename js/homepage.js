$("#login-tab").click(function () {
    $("#signup-tab").css("backgroundColor", "white")
    $("#login-tab").css("backgroundColor", "#EBEBF5")
    $("#form-signup").css("display", "none")
    $("#form-login").css("display", "inherit")
    $("#login-tab").css("opacity", "1")
    $("#signup-tab").css("opacity", "0.50")

});

$("#signup-tab").click(function () {
    $("#signup-tab").css("backgroundColor", "#EBEBF5")
    $("#login-tab").css("backgroundColor", "white")
    $("#form-signup").css("display", "inherit")
    $("#form-login").css("display", "none")
    $("#login-tab").css("opacity", "0.50")
    $("#signup-tab").css("opacity", "1")

});

function addUser()
{
    /*$("#submitButton").click(function() {
        
        var errorMessage = "";
        var fieldsMissing = "";
        
        if ($("#email").val() == "") {
            
            fieldsMissing += "<br>Email";
            
        }
        
        
        if ($("#password").val() == "") {
            
            fieldsMissing += "<br>Password";
            
        }
        
        
        if (fieldsMissing != "") {
            
            errorMessage += "<p>The following field(s) are missing:" + fieldsMissing;
            
        }
        
        if (isEmail($("#email").val()) == false) {
            
            errorMessage += "<p>Your email address is not valid</p>";
            
        }
        
        
        if ($("#password").val() != $("#passwordConfirm").val()) {
            
            errorMessage += "<p>Your passwords don't match</p>";
            
        }
        
        if (errorMessage != "") {
            
            $("#errorMessage").html(errorMessage);
            
        } else {
            
            $("#successMessage").show();
            $("#errorMessage").hide();
            
        }
        
    });*/
    
    
}
