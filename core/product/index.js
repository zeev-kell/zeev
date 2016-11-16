/**
 * Created by zeev on 2016/11/16 0016.
 */

$(function () {
	var i = 0;
	$('.animate-box').waypoint(function (direction) {
		if (direction === 'down' && !$(this.element).hasClass('animated')) {
			i++;
			$(this.element).addClass('item-animate');
			setTimeout(function () {
				$('body .animate-box.item-animate').each(function (k) {
					var el = $(this);
					setTimeout(function () {
						var cl = el.attr("data-animation") ? el.attr("data-animation") + " animated" : "fadeInUp animated";
						el.addClass(cl);
						el.removeClass('item-animate');
					}, k * 200, 'easeInOutExpo');
				});
			}, 100);
		}
	}, { offset: '85%' });
})