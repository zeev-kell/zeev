'use strict';
window.onload = function () {
	var textArray = ["Front End Developer", "Front End Developer", "Front End Developer", "Front End Developer"];
	new TxtRotate(document.getElementById("keyword"), textArray, 1000);
	var start = window.start = new Start({
		canvas: document.getElementById("effect")
	});
}