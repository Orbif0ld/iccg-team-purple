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
    $("a[data-remote]").on("ajax:success", function () {
        $("#signup_modal").modal("show");
    });
}

var do_all = function() {
    show_sign_in_if_logged_out();
    add_listeners();
};

$(do_all);
