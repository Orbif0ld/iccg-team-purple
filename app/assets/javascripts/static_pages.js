var show_sign_in_if_logged_out = function () {
    $.ajax({
        type: "GET",
        url: "/login_status",
        dataType: "JSON",
        success: function (logged_in) {
            if (!logged_in) {
                $("#signup_modal").modal("show");
            }
        },
        error: function() {
            alert("data not loaded from server");
        }
    });
};

var add_listeners = function () {
    $("[action='/login']").on("ajax:success", function () {
        console.log("Hello!");
        $("#signup_modal").modal("hide");
        $("#error_msg").hide()
    }).on("ajax:error", function () {
        console.log("Wrong email or password.");
        $("#error_msg").show()
    });

    $("[href='/logout']").on("ajax:success", function (response) {
        console.log("Bye!");
        $("#signup_modal").modal("show");
    });
}

var init = function() {
    show_sign_in_if_logged_out();
    add_listeners();
};

$(init);
