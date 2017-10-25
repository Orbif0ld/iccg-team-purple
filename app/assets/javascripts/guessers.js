var wb_ui = new WhiteboardUi();
var round_ui = new RoundUi();

var add_listeners = function () {

    if ($("#info").data("role") != "guesser") {return;};
    
    // show full whiteboard on hover
    $("#whiteboard").hover(function() {
        wb_ui.open();
    }, function() {
        wb_ui.close();
    });

    // toggle whiteboard on click
    $("#whiteboard").click(function() {
        wb_ui.toggle();
    });
};

var same = function (reference, data) {
    var keys = Object.keys(reference);
    for (var i in keys) {
        var p = keys[i];
        if (reference.hasOwnProperty(p)) {
            //console.log("reference[" + p + "] = " + reference[p]);
            //console.log("data[" + p + "] = " + data[p]);
            if (reference[p] != data[p]) {
                //console.log("does not match!");
                return false;
            };
        };
    };
    return true;
};

var data = {};

var add_poll = function () {

    if ($("#info").data("role") != "guesser") {return;};

    setInterval(function () {
        $.getJSON($("#info").data("source"), function (new_data) {
            data = new_data;
            round_ui.populate(data);
            
            if (data.new_round && (round_ui.does_not_display("waiting for question") &&
                                   round_ui.does_not_display("question form"))) {
                $("#wb_head_refresh").load($("#info").data("wb_head_refresh_path"));
                $("#whiteboard_body").load($("#info").data("wb_tail_refresh_path"));
                if (data.is_questioner) {
                    round_ui.show_question_form();
                } else {
                    round_ui.show_waiting_for_question();
                };
            } else if (data.requires_answer && round_ui.does_not_display("answer form")) {
                round_ui.show_answer_form();
            } else if (data.reviewing && round_ui.does_not_display("review")) {
                round_ui.show_review();    
            } else if (data.game_over) {
                console.log("game is over");
            };
        });
    }, 1000);
};

$(add_listeners);
$(add_poll);
