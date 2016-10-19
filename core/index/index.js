'use strict';
window.onload = function() {
    var textArray = ["Front End Developer", "Front End Developer", "Front End Developer", "Front End Developer"];
    new TxtRotate(document.getElementById("keyword"), textArray, 1000);
    cvsEffect.one();
    cvsEffect.start()
}

$(function() {
	$("#nav li").mouseenter(function(event){
		event.preventDefault();
		event.stopPropagation();
		console.log(this);
	})
})
