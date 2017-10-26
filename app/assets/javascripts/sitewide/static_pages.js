var waiting_for_invite = false;
var waiting_for_accepts = false;

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

// check user's stat and show/hide queue/dequeue buttons accordingly
var update = function() {
    $.ajax({
        type: "GET",
        url: '/sync_games_managers/user_activity',
        dataType: "JSON",
        success: function (user) {

            // show queue/dequeue buttons when appropriate
            if (user.activity != "queued") {
                $("#cleansing_fire,#central_dequeue").hide();
                $("#queue_button").show();
            } else {
                $("#cleansing_fire,#central_dequeue").show();
                $("#queue_button").hide();
            };

            // show the quit game button if the user is registered as playing 
            if (user.activity != "playing") {
                $("#quit_game_button").hide();
            } else {
                $("#quit_game_button").show();
            };
        }});
};

// checks if user has an invite. If so, displays the modal and sets indicator variables.
var check_for_invite = function () {
    if (waiting_for_invite) {
        $.ajax({
            type: "GET",
            url: '/sync_games_managers/user_activity',
            dataType: "JSON",
            success: function (user) {
                if (user.game_available) {
                    waiting_for_invite = false;
                    waiting_for_accepts = true;
                    $("#invite_status_indicator").text(user.invite_status + "users have accepted");
                    $("#accept_decline").show();
                    $("#invite_modal").modal("show");
                };
            }});
    };
}

// check whether anyone else accepted or declined the invite and act accordingly
var update_invite_status = function () {
    if (waiting_for_accepts) {
        $.ajax({
            type: "GET",
            url: '/sync_games_managers/user_activity',
            dataType: "JSON",
            success: function (user) {
                $("#invite_status_indicator").text(user.invite_status + " users have accepted");
                // if someone declines, reset and hide the modal
                if (!(user.game_available || user.game_started)) {
                    $("#invite_status_indicator").text("Somebody declined the game.");
                    setTimeout(function() {
                        $("#invite_modal").modal("hide");
                        update(); // make sure that dequeue buttons are visible
                                  // (because this user is still queued).
                        waiting_for_invite = true; // reset indicator variables
                        waiting_for_accetps = false;
                    }, 3000);

                // send to game, reset and close the modal, once everyone has accepted
                } else if (user.game_started) {
                    waiting_for_accepts = false;
                    $.get("/sync_games_managers/send_to_game");
                    $("#invite_modal").modal("hide");
                    $("#invite_status_indicator").text("0 users have accepted");
                };
            }});
    };
};

var add_listeners = function () {
    // close the modal if login succeeds, dsiplay error message otherwise
    $("[action='/login']").on("ajax:success", function () {
        console.log("Hello!");
        $("#signup_modal").modal("hide");
        $("#error_msg").hide()
        location.reload(true); //reload from server for redirect in case player is in a game
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
        waiting_for_invite = true;
        waiting_for_accepts = false;
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
                waiting_for_invite = false;
                update();
            }
        });
    });

    // pressing the accept button on an invite signals the server that the user has accepted
    $("#accept_button").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/sync_games_managers/accept_invite",
            dataType: "JSON",
            success: function () {
                waiting_for_invite = false;
                waiting_for_accepts = true;
                $("#accept_decline").hide();
                console.log("Accepted invite.");
                update();
            }
        });
    });

    // pressing the decline button on an invite dequeues the user
    $("#decline_button").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/sync_games_managers/decline_invite",
            dataType: "JSON",
            success: function () {
                waiting_for_invite = false;
                waiting_for_accepts = false;
                console.log("Declined invite.");
                update();
            }
        });
    });

    // pressing the quit game button removes the player from the game
    // and redirects to home
    $("#quit_game_button").on("click", function () {
        $.post($("#header_info").data("quit_game_path"), function () {
            document.location.href = "/";
        });
    });
}

var periodic_events = function () {
    setInterval(check_for_invite, 3000);
    setInterval(update_invite_status, 500);
};

var init = function() {
    show_sign_in_if_logged_out();
    add_listeners();
    update();
    periodic_events();
    $('#vote_to_quit_modal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });
    $('#signup_modal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });
    $('#game_over_modal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });
};

$(init);
