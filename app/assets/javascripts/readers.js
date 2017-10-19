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

// Represents question and answer input and displays.
var RoundUi = function () {

    var is_questioner;

    this.new_round = function (is_q) {
        is_questioner = is_q;
        clear_all();
        hide_question();
        hide_answers();
        if (is_questioner) {
            show_question_form();
        } else {
            hide_question_form();
        };
    };

    this.try_question = function () {
        var question = $("#question")[0].value;
        if (valid(question)) {
            question_warning_off();
            hide_question_form();
            set_question(question);
            show_question();
            show_answer_form();
            return question;
        } else {
            question_warning_on();
            return false;
        };
    };

    this.try_answer = function () {
        var answer = $("#answer")[0].value
        if (valid(answer)) {
            answer_warning_off();
            hide_answer_form();
            set_reader_answer(answer);
            show_answers();
            return answer;
        } else {
            answer_warning_on();
            return false;
        };
    };

    this.set_reader_answer = function (answer) {
        set_reader_answer(answer);
    };

    this.set_guesser_answer = function (answer) {
        set_guesser_answer(answer);
    };

    this.set_question = function (question) {
        set_question(question);
        if (!is_questioner) {
            show_question();
            show_answer_form();
        };
    };

    //////////////////// helpers ////////////////////

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

    var set_reader_answer = function (answer) {
        $("#reader_answer_text").text(answer);
    };

    var set_guesser_answer = function (answer) {
        $("#guesser_answer_text").text(answer);
    };

    var clear_all = function () {
        $("#question")[0].value = "";
        $("#answer")[0].value = "";
        set_question("");
        set_reader_answer("...");
        set_guesser_answer("...");
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

var do_all = function () {
    add_listeners();
};

$(do_all);
