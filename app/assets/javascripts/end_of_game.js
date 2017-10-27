
// given round data, produces an object containting three strings which describe the game
// so far:
// x rounds were played.
// The reader convinced the judge of his indentity y times.
// The guesser deceived the judge z times.
var report = function (data) {
    var num_convinced = data.scores["reader"];
    var num_deceived = data.scores["guesser"];
    var num_rounds = num_convinced + num_deceived;
    var pluralization1 = (num_rounds === 1) ? "was" : "s were";
    var pluralization2 = (num_convinced === 1) ? "" : "s";
    var pluralization3 = (num_deceived === 1) ? "" : "s";

    var r1 = num_rounds + " round" + pluralization1 + " played.";
    var r2 = "The reader convinced the judge of his identity " + num_convinced +
        " time" + pluralization2;
    var r3 = "The guesser deceived the judge " + num_deceived + " time" + pluralization3;

    var report = {line1: r1, line2: r2, line3: r3};

    return report;
};

var populate_end_of_game_modal = function (data) {
    var r = report(data);
    $("#report_line_1").text(r.line1);
    $("#report_line_2").text(r.line2);
    $("#report_line_3").text(r.line3);
};
