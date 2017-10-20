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
// This class ensures that incorrect sequences of class method calls
// cannot result in an illegal interface configuration.
// Example illegal configuration: displaying the answer form but not the question.
// If class methods are called from the wrong state they will not change the DOM and
// display a message in the log.
var RoundUi = function () {

    var state = "game_start";
    var guesser_answer = false;
    var reader_answer = false;
    var is_questioner;
    var states = ["await_question", "ask_question", "answer", "review", "game_start"];

    this.no_round_set = function () {
        return (state === "review" || state === "game_start");
    };
    
    this.no_question = function () {
        return (state === "await_question");
    };

    this.no_reader_answer = function () {
        return reader_answer;
    };
    
    this.no_guesser_answer = function () {
        return guesser_answer;
    };
    
    // the following methods change the visibilty of UI elements and cause state transitions.
    
    // should be called at the start of each round
    // param is_questioner: a boolean indicating whether the viewer get to ask a question during this round
    // makes the apporpriate elements visible in the DOM
    this.new_round = function (is_q) {
        if (state === "game_start" || state === "review") {
            is_questioner = is_q;
            guesser_answer = false;
            state = is_questioner ? "ask_question" : "await_question";
            clear_all();
            hide_question();
            hide_answers();
            if (is_questioner) {
                show_question_form();
                $("#ask_btn").on ("click", function() {
                    console.log("ask button triggered");
                    var question = round_ui.try_question();
                    console.log("question is: " + question);
                    if (question != false) {
                        $.post($("#info").data("submit_question"), {question: question}, function () {console.log("question sent")});
                    };
                });
            } else {
                hide_question_form();
            };
        } else {
            console.log("new_round should not be called in state " + state);
        };
    };

    // Attempts submission of the question from the appropriate form.
    // A question is considered valid if it is not solely composed of whitespace characters.
    // If the question is valid, manipualtes the DOM to make the next stage of the game available.
    // Else, manipulates the DOM to indicate the invalidity of the input.
    this.try_question = function () {
        if (state === "ask_question") {
            var question = $("#question")[0].value;
            if (valid(question)) {
                state = "answer";
                question_warning_off();
                hide_question_form();
                set_question(question);
                show_question();
                show_answer_form();
                answ_btn_listen();
                return question;
            } else {
                question_warning_on();
                return false;
            };
        } else {
            console.log("try_question should not be called in state " + state);
        };
    };

    // Attempts submission of the answer from the appropriate form.
    // An answer is considered valid if it is not solely composed of whitespace characters.
    // If the answer is valid, manipualtes the DOM to make the next stage of the game available.
    // Else manipulates the DOM to indicate the invalidity of the input.
    this.try_answer = function () {
        if (state === "answer") {
            var answer = $("#answer")[0].value
            if (valid(answer)) {
                state = "review";
                answer_warning_off();
                hide_answer_form();
                set_reader_answer(answer);
                show_answers();
                return answer;
            } else {
                answer_warning_on();
                return false;
            };
        } else {
           console.log("try_answer should not be called in state " + state); 
        };
    };

    // Sets a question without checking validity; the assumption is that the question was submitted
    // by another player and has arrived via the server. Manipualtes the DOM to make the next stage
    // of the game available.
    // param question: a string repersenting the question
    this.set_question = function (question) {
        if (state === "await_question") {
            state = "answer";
            set_question(question);
            if (!is_questioner) {
                show_question();
                show_answer_form();
                answ_btn_listen();
            };
        } else {
            console.log("set_question should not be called in state " + state); 
        };
    };

    // the following methods do not change the visiblity of any elements
    // and do not cause state transitions.

    this.set_reader_answer = function (answer) {
        reader_answer = true;
        set_reader_answer(answer);
    };

    this.set_guesser_answer = function (answer) {
        guesser_answer = true;
        set_guesser_answer(answer);
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

    var answ_btn_listen = function () {
        $("#answer_btn").on("click", function() {
            round_ui.try_answer();
        });
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

    setInterval(function () {
        $.getJSON($("#info").data("source"), function (data) {
            if (!data.question_available && round_ui.no_round_set()) {
                round_ui.new_round(data.is_questioner);
            } else if (data.question_available && round_ui.no_question()) {
                round_ui.set_question(data.question);
            } else if (data.guesser_answer != null && round_ui.no_guesser_answer()) {
                round_ui.set_question(data.guesser_answer);
            } else if (data.game_over) {
                console.log("game over");
            };
        });
    }, 1000);
};

$(do_all);
