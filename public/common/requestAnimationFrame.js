/**
 * Created by zeev on 2017/1/5 0005.
 */
(function () {
	for (let n = 0, e = ["webkit", "moz"], i = 0; i < e.length && !window.requestAnimationFrame; ++i) {
		window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"];
		window.cancelAnimationFrame  = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"];
	}
	window.requestAnimationFrame || (window.requestAnimationFrame = function (e, i) {
		let o = (new Date).getTime(), t = Math.max(0, 16.7 - (o - n)), a = window.setTimeout(function () {
			e(o + t)
		}, t);
		return n = o + t, a
	});
	window.cancelAnimationFrame || (window.cancelAnimationFrame = function (n) {
		clearTimeout(n)
	})
})();