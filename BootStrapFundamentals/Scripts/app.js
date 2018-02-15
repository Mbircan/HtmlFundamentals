/// <reference path="jquery-3.3.1.js" />
/// <reference path="jquery-ui-1.12.1.js" />
/// <reference path="bootstrap.js" />


$("#slider-range").slider({
    range: true,
    min: 0,
    max: 500,
    values: [50, 100],
    slide: function (event, ui) {
        $("#amount").val("$" + ui.values[0] + "-$" + ui.values[1])
    }
});