'use strict';
window.onload = function () {
	var textArray = ["Front End Developer", "Front End Developer", "Front End Developer", "Front End Developer"];
	new TxtRotate(document.getElementById("keyword"), textArray, 1000);
	Effect.one();
	Effect.start();
}

//$(function () {
	//    $("#nav li").mouseenter(function(event) {
	//        var _this = $(this);
	//        event.preventDefault();
	//        event.stopPropagation();
	// var index = Number(_this.attr("index"));
	// Effect.change(index);
	//    })
//})
