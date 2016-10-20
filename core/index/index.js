'use strict';
window.onload = function() {
    var textArray = ["Front End Developer", "Front End Developer", "Front End Developer", "Front End Developer"];
    new TxtRotate(document.getElementById("keyword"), textArray, 1000);
    Effect.one();
    Effect.start();
}

$(function() {
    $("#nav li").mouseenter(function(event) {
        var _this = $(this);
        event.preventDefault();
        event.stopPropagation();
        console.log(_this.attr("index"));
        Effect.change(1);
        // $("body").css("background-color","#FFFFFF")
    })
})
