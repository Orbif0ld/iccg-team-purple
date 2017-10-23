// Strategy:
// Capitalized functions represent abstract data types for ui elements
// for document, whiteboard, question and answers. Their methods cause the
// appropriate manipulations in the DOM.
// Event listeners connect various user inputs to these methods.
// The server is regularly polled for new data, and the ADTs' methods are
// called to update the view.

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
