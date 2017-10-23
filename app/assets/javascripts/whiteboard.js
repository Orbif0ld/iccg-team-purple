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
