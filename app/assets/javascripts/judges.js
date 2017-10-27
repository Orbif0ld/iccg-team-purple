
var Answers = function () {

    var selected = false;

    this.highlight_answer_1 = function () {
        set_highlight($("#answer1_panel"));
    };

    this.lowlight_answer_1 = function () {
        set_lowlight($("#answer1_panel"));
    };

    this.highlight_answer_2 = function () {
        set_highlight($("#answer2_panel"));
    };

    this.lowlight_answer_2 = function () {
        set_lowlight($("#answer2_panel"));
    };

    this.select_answer_1 = function () {
        if (!selected) {
            set_selectlight($("#answer1_panel"));
            selected = true;
            $.post($("#info").data("target"), {better_answer: "answer1"});
        };
    };

    this.select_answer_2 = function () {
        if (!selected) {
            set_selectlight($("#answer2_panel"));
            selected = true;
            $.post($("#info").data("target"), {better_answer: "answer2"});
        };
    };

    this.deselect = function () {
        $("#answer1_panel").attr("style", "cursor:pointer;" + lowlight_color);
        $("#answer2_panel").attr("style", "cursor:pointer;" + lowlight_color);
        selected = false;
    }

    this.set = function (answers) {
        $("#answer1_text").text(answers["answer1"]);
        $("#answer2_text").text(answers["answer2"]);
    }

    // helpers //

    var lowlight_color = "white";
    var highlight_color = "background:#5E8ED1";
    var select_color = "background:#44E037";

    var set_selectlight = function (elem) {
        elem.attr("style", "cursor:pointer;" + select_color);
    };

    var set_highlight = function (elem) {
        elem.attr("style", "cursor:pointer;" + highlight_color);
    };

    var set_lowlight = function (elem) {
        elem.attr("style", "cursor:pointer;" + lowlight_color);
    };
};

var JudgeUi = function () {

    var displays = "nothing";

    this.show_waiting_for_question = function () {
        displays = "waiting for question";
        set_waiting();
        $("#answers_panel").fadeOut();
    };

    this.show_judgement = function () {
        dsiplays = "judgement";
        $("#answers_panel").fadeIn();
    };

    this.set_question = function (question) {
        displays = "waiting for answers";
        $("#question_text").text(question);
    };

    this.displays = function (description) {
        return (displays === description);
    };
    
    this.does_not_display = function (description) {
        return (displays != description);
    };

    // helpers //

    var set_waiting = function () {
        $("#question_text").text(" ... waiting ...");
    };
};

var doc_ui = new DocumentUi();
var wb_ui = new WhiteboardUi();
var answers = new Answers();
var judge_ui = new JudgeUi();

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

var add_listeners = function () {

    if ($("#info").data("role") != "judge") {return;};
    
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

    // show document on hover
    $("#document").hover(function() {
        doc_ui.open();
    }, function() {
        doc_ui.close();
    });

    // toggle document on click
    $("#document").click(function() {
        doc_ui.toggle();
    });

    // highlight answer_1 selector on hover
    $("#answer1_panel").hover(function() {
        answers.highlight_answer_1();
    }, function() {
        answers.lowlight_answer_1();
    });

    // highlight answer_1 selector on hover
    $("#answer2_panel").hover(function() {
        answers.highlight_answer_2();
    }, function() {
        answers.lowlight_answer_2();
    });

    // select answer on click
    $("#answer1_panel").click(function() {
        answers.select_answer_1();
        setTimeout( function () {
            judge_ui.show_waiting_for_question();
            setTimeout(answers.deselect, 200);
        }, 300);
    });

    $("#answer2_panel").click(function() {
        answers.select_answer_2();
        setTimeout( function () {
            judge_ui.show_waiting_for_question();
            setTimeout(answers.deselect, 200);
        }, 300);
    });

    // tell the server that the user is leavnig the game and
    // go back to the home page when leaving the end of game modal
    $("#game_over_leave_button").click(function() {
        $.post($("#header_info").data("quit_game_path"), function () {
            $("#game_over_modal").modal("hide");
            document.location.href = "/";
        });
    });
};

var add_poll = function () {

    var end_of_game_modal_shown = false;

    if ($("#info").data("role") != "judge") {return;};
    
    setInterval( function () {
        $.getJSON($("#info").data("source"), function (data) {
            if (end_of_game_modal_shown) {return;}
            if (data.game_over) {
                console.log("game is over");
                populate_end_of_game_modal(data);
                $("#game_over_modal").modal("show");
                end_of_game_modal_shown = true;
            } else if (data.question_available &&
                judge_ui.does_not_display("waiting for answers")) {
                judge_ui.set_question(data.question);
            } else if (data.answers_available &&
                       judge_ui.does_not_display("judgement")) {
                answers.set(data.answers);
                judge_ui.show_judgement();
            } else if (judge_ui.displays("waiting for question")) {
                $("#wb_head_refresh").load($("#info").data("wb_head_refresh_path"));
                $("#whiteboard_body").load($("#info").data("wb_tail_refresh_path"));
            };
            
        })
    }, 1000);
};

$(add_listeners);
$(add_poll);
