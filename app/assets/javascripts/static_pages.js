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

var update = function() {
    $.ajax({
        type: "GET",
        url: '/sync_games_managers/user_activity',
        dataType: "JSON",
        success: function (user) {
            if (user.activity != "queued") {
                $("#cleansing_fire,#central_dequeue").hide();
                $("#queue_button").show();
            } else {
                $("#cleansing_fire,#central_dequeue").show();
                $("#queue_button").hide();
            };
        }});
};

var check_for_invite = function () {
    $.ajax({
        type: "GET",
        url: '/sync_games_managers/user_activity',
        dataType: "JSON",
        success: function (user) {
            if (user.game_available) {
                $("#invite_modal").modal("show");
            };
        }});
}

var add_listeners = function () {
    // close the modal if login succeeds, dsiplay error message otherwise
    $("[action='/login']").on("ajax:success", function () {
        console.log("Hello!");
        $("#signup_modal").modal("hide");
        $("#error_msg").hide()
    }).on("ajax:error", function () {
        console.log("Wrong email or password.");
        $("#error_msg").show()
    });

    // open the login modal if just logged out
    $("[href='/logout']").on("ajax:success", function (response) {
        console.log("Bye!");
        $("#signup_modal").modal("show");
    });

    // queue when the queue-preferences are submitted
    $("#submit_preferences_button").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/sync_games_managers/enqueue",
            dataType: "JSON",
            success: function () {
                console.log("Queued up.");
                update();
            }
        });
    });

    // dequeue when the dequeue button is pressed
    $("#cleansing_fire,#central_dequeue").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/sync_games_managers/dequeue",
            dataType: "JSON",
            success: function () {
                console.log("Dequeued.");
                update();
            }
        });
    });
}

var init = function() {
    update();
    show_sign_in_if_logged_out();
    add_listeners();
};

$(init);
