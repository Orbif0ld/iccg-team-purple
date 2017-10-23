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

window.RoundUi = RoundUi;
