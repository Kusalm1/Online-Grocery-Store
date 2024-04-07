var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/groceryStory";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
function loginUser() {

    if (checkIsNull($("#usernameId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Please fill all Data");
    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/userRegister.json",
            success: function (lresponse) {
                let loginUserList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].userName == $("#usernameId").val() && loginUserList[i].password == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("loginUserDetails", JSON.stringify(loginUserList[i]));
                        window.location.href = "groceryStore.html";

                    }
                }
                if (!isValid) {
                    alert("User not found");
                }
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}

function isValidUser() {
    if (checkIsNull($("#userNameId").val()) || checkIsNull($("#userEmailId").val())
        || checkIsNull($("#passwordId").val()) || checkIsNull($("#contactId").val())
        || checkIsNull($("#userFullNameId").val())
        || checkIsNull($("input[name='userTypeRadio']:checked").val())) {
        alert("Please fill all the details for registration");
    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/userRegister.json",
            success: function (lresponse) {
                let loginUserList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = true;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].userName == $("#userNameId").val()) {
                        isValid = false;
                        break;

                    }
                }
                isValid ? registerUser() : alert("User already registered !!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}

function registerUser() {

    let requestBody = {
        "userName": $("#userNameId").val(),
        "emailId": $("#userEmailId").val(),
        "password": $("#passwordId").val(),
        "contactNum": $("#contactId").val(),
        "userType": $("input[name='userTypeRadio']:checked").val(),
        "userFullNameId": $("#userFullNameId").val()
    }
    $.ajax({
        type: 'post',
        contentType: "application/json",
        dataType: 'json',
        cache: false,
        cache: false,
        url: URL + "/userRegister.json",
        data: JSON.stringify(requestBody),
        success: function (lresponse) {
            resetData();
            $(".loginCls").show();
            $(".signupCls").hide();
            alert("Registerd sucessfully!!!");
        }, error: function (error) {
            alert("Something went wrong");
        }
    });
}

function resetData() {
    $("#userNameId").val("");
    $("#userEmailId").val("");
    $("#passwordId").val("");
    $("#contactId").val("");
    $("input[type=radio][name=userTypeRadio]").prop("checked", false);
    $("#userFullNameId").val("");

}
function isLoginType(isLoginType) {
    $(".loginCls").hide();
    $(".signupCls").hide();
    if (isLoginType) {
        $(".loginCls").show();
    } else {
        $(".signupCls").show();
    }
}
$(document).ready(function () {
    $(".loginCls").show();
    $(".signupCls").hide();
});
