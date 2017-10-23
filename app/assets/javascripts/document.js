
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
