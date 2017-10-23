// Strategy:
// Capitalized functions represent abstract data types for ui elements
// for document, whiteboard, question and answers. Their methods cause the
// appropriate manipulations in the DOM.
// Event listeners connect various user inputs to these methods.
// The server is regularly polled for new data, and the ADTs' methods are
// called to update the view.

// Represents the horizontal, collapsable document panel.
var DocumentUi = function () {

    var toggled_on = false;
    var hover = false;

    // Makes the full document visible, if the document is currently toggled off.
    // No effect if document is toggled on.
    this.open = function () {
        hover = true;
        if (!toggled_on) {
            $("#doc_instruction").text("tap to keep open");
            show_document();
        };
    };

    // If the document is currently toggled off:
    // Waits a short time and collapses the document if close_document
    // was triggered more recently. If open_document was triggered more recently,
    // the document remains open. This is usefull for preventing the document from
    // collapsing and opening repeatedly if the cursor oscillates across the document
    // boundary.
    // No effect if document is toggled on.
    this.close = function () {
        hover = false;
        if (!toggled_on) {
            setTimeout(function () {
                if (!hover) {
                    $("#doc_instruction").text("tap or hover to expand");
                    hide_document();
                };
            }, 500);
        };
    };

    // Toggles the document between it's closed and it's opened state.
    // close_document and open_document are ignored while the document
    // is toggle on.
    this.toggle = function () {
        toggled_on = !toggled_on;
        if (toggled_on) {
            $("#doc_instruction").text("tap to collapse");
            show_document();
        } else {
            $("#doc_instruction").text("tap to expand");
            hide_document();
        };
    };

    //////////////////// helpers ////////////////////

    var show_document = function () {
        $("#document_body").slideDown();
    };

    var hide_document = function () {
        $("#document_body").slideUp();
    };
};

// Represents the horizontal, collapsable whiteboard panel.
var WhiteboardUi = function () {

    var toggled_on = false;
    var hover = false;

    // Makes the full whiteboard visible, if the whiteboard is currently toggled off.
    // No effect if whiteboard is toggled on.
    this.open = function () {
        hover = true;
        if (!toggled_on) {
            $("#wb_instruction").text("tap to keep open");
            show_whiteboard();
        };
    };

    // If the whiteboard is currently toggled off:
    // Waits a short time and collapses the whiteboard if close
    // was triggered more recently. If open was triggered more recently,
    // the whiteboard remains open. This is usefull for preventing the whiteboard from
    // collapsing and opening repeatedly if the cursor oscillates across the whiteboard
    // boundary.
    // No effect if document is toggled on.
    this.close = function () {
        hover = false;
        if (!toggled_on) {
            setTimeout(function () {
                if (!hover) {
                    $("#wb_instruction").text("tap or hover to expand");
                    hide_whiteboard();
                };
            }, 500);
        };
    };

    // Toggles the whiteboard between it's closed and it's opened state.
    // close and open are ignored while the whiteboard
    // is toggle on.
    this.toggle = function () {
        toggled_on = !toggled_on;
        if (toggled_on) {
            $("#wb_instruction").text("tap to collapse");
            show_whiteboard();
        } else {
            $("#wb_instruction").text("tap to expand");
            hide_whiteboard();
        };
    };

    //////////////////// helpers ////////////////////

    var show_whiteboard = function () {
        $("#whiteboard_body").slideDown();
    };

    var hide_whiteboard = function () {
        $("#whiteboard_body").slideUp();
    };
};

// Manipualtes question and answer input and displays.
var RoundUi = function () {

    var displays = "nothing";

    this.clear = function() {
        dsiplays = "nothing";
        hide_all();
        clear_all();
    };

    this.populate = function(data) {
        set_question(data.question);
        var role = get_role();
        var this_answer = (data.this_answer != null) ? data.this_answer : "...";
        var other_answer = (data.other_answer != null) ? data.other_answer : "...";
        set_this_answer(this_answer);
        set_other_answer(other_answer);
    };
    
    this.show_waiting_for_question = function () {
        displays = "waiting for question";
        clear_all();
        hide_all();
    };

    this.show_question_form = function () {
        displays = "question form";
        clear_all();
        hide_all();
        show_question_form();
        ask_btn_listen();
    };

    // Attempts submission of the question from the appropriate form.
    // A question is considered valid if it is not solely composed of whitespace characters.
    this.try_question = function () {
        var question = $("#question")[0].value;
        if (valid(question)) {
            displays = "answer form";
            question_warning_off();
            set_question(question);
            hide_all();
            show_question();
            show_answer_form();
            answ_btn_listen();
            return question;
        } else {
            question_warning_on();
            return false;
        };
    };

    this.show_answer_form = function () {
        displays = "answer form";
        hide_all();
        show_question();
        show_answer_form();
        answ_btn_listen();
    };

    // Attempts submission of the answer from the appropriate form.
    // An answer is considered valid if it is not solely composed of whitespace characters.
    // If the answer is valid, manipualtes the DOM to make the next stage of the game available.
    // Else manipulates the DOM to indicate the invalidity of the input.
    this.try_answer = function () {
        var answer = $("#answer")[0].value
        if (valid(answer)) {
            displays = "review";
            answer_warning_off();
            set_this_answer(answer);
            hide_all();
            show_question();
            show_answers();
            return answer;
        } else {
            answer_warning_on();
            return false;
        };
    };

    this.show_review = function () {
        displays = "review";
        hide_all();
        show_question();
        show_answers();
    };

    this.set_other_answer = function (answer) {
        set_other_answer(answer);
    };

    this.set_question = function (question) {
        set_question(question);
    };

    this.displays_what = function () {
        return displays;
    };

    this.displays = function (description) {
        return (displays === description);
    }

    this.does_not_display = function (description) {
        return !(displays === description);
    };

    //////////////////// helpers ////////////////////

    var get_role = function() {
        return $("#info").data("role");
    };

    var hide_all = function() {
        hide_question_form();
        hide_question();
        hide_answer_form();
        hide_answers();
    };

    var valid = function (input) {
        return (input.replace(/\s/g, '').length > 0)
    };
    
    var show_question_form = function () {
        $("#question_form").show();
    };

    var hide_question_form = function () {
        $("#question_form").hide();
    };

    var show_question = function () {
        $("#question_display").show();
    };

    var hide_question = function () {
        $("#question_display").hide();
    };

    var show_answers = function () {
        $("#answers_display").show();
    };

    var hide_answers = function () {
        $("#answers_display").hide();
    };

    var show_answer_form = function () {
        $("#answer_form").show();
    };

    var hide_answer_form = function () {
        $("#answer_form").hide();
    };

    var question_warning_on = function() {
        $("#warning_q")[0].className = "form-group has-warning has-feedback";
    };

    var question_warning_off = function () {
        $("#warning_q")[0].className = "form-group";
    };

    var set_question = function (question) {
        $("#question_text").text(" " + question);
    };

    var answer_warning_on = function() {
        $("#warning_a")[0].className = "form-group has-warning has-feedback";
    };

    var answer_warning_off = function () {
        $("#warning_a")[0].className = "form-group";
    };

    var set_this_answer = function (answer) {
        $("#this_answer_text").text(answer);
    };

    var set_other_answer = function (answer) {
        $("#other_answer_text").text(answer);
    };

    var ask_btn_listen = function () {
        $("#ask_btn").on ("click", function() {
            console.log("ask button triggered");
            var question = round_ui.try_question();
            console.log("question is: " + question);
            if (question != false) {
                $.post($("#info").data("submit_question"), {question: question}, function () {console.log("question sent")});
            };
        });
    };

    var answ_btn_listen = function () {
        $("#answer_btn").on("click", function() {
            console.log("answer button triggered");
            var answer = round_ui.try_answer();
            console.log("answer is: " + answer);
            if (answer != false) {
                $.post($("#info").data("submit_answer"), {answer: answer}, function () {console.log("answer sent")});
            };
        });
    };

    var clear_all = function () {
        $("#question")[0].value = "";
        $("#answer")[0].value = "";
        set_question("");
        set_this_answer("...");
        set_other_answer("...");
    };
        
};

var doc_ui = new DocumentUi();
var wb_ui = new WhiteboardUi();
var round_ui = new RoundUi();

var add_listeners = function () {
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

// var data = {o: 1, p: 2};
// var data_false = {o: 1, p: 3};
// var empty = {};
// var reference = {o: 1, p: 2};

var data = {};

var do_all = function () {
    add_listeners();

    $.get($("#info").data("source"), function(d) {data = d;});

    setInterval(function () {
        $.getJSON($("#info").data("source"), function (new_data) {
            if (same(data, new_data)) {
                return;
            } else {
                data = new_data;
                round_ui.populate(data);
            };
            
            if (data.new_round && (round_ui.does_not_displays("waiting for question") || round_ui.does_not_display("question form"))) {
                if (data.is_questioner) {
                    round_ui.show_question_form();
                } else {
                    round_ui.show_waiting_for_question();
                };
            } else if (data.requires_answer && round_ui.does_not_display("answer form")) {
                round_ui.show_answer_form();
            } else if (data.reviewing && round_ui.does_not_display("review")) {
                round_ui.show_review();
            };
        });
    }, 1000);
};

$(do_all);
