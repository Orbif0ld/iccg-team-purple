var interface = function () {

    this.open_whiteboard = function () {};

    this.close_whiteboard = function () {};

    this.show_answers = function () {};

    this.show_question = function () {};

    this.select_answer = function () {};

    this.submit = function () {};

    this.vote_to_quit = function () {};
};

var add_listeners = function () {
    // show full whiteboard on hover
    $("#whiteboard").hover(function() {
        $("#whiteboard_body").slideDown();
    }, function() {
        $("#whiteboard_body").slideUp();
    });

    // show document on hover
    $("#document").hover(function() {
        $("#document_body").slideDown();
    }, function() {
        setTimeout(function () {
            $("#document_body").slideUp();
        }, 500);
    });
};

$(add_listeners);
