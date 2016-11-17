/**
 * Created by zeev on 2016/11/16 0016.
 */

$(function () {
	$('.animate-box').waypoint(function (direction) {
		if (direction === 'down' && !$(this.element).hasClass('animated')) {
			$(this.element).addClass('item-animate');
			setTimeout(function () {
				var time = 0;
				$('body .animate-box.item-animate').each(function (k) {
					var el    = $(this);
					var cl    = el.attr("data-animation") ? el.attr("data-animation") + " animated" : "fadeInUp animated";
					var delay = el.attr("data-delay") ? Number(el.attr("data-delay")) : 0;
					time      = time + 100 + delay;
					setTimeout(function () {
						el.addClass(cl);
						el.removeClass('item-animate');
					}, time, 'easeInOutExpo');
				});
			}, 100);
		}
	}, { offset: '85%' });

	$(window).on('scroll', {
		previousTop: 0
	}, function () {
		var top  = $(window).scrollTop();
		var winH = $(window).height() - 40;
		if (top < this.previousTop) {
			if (top > winH && $('.navbar').hasClass('is-fixed')) {
				$('.navbar').addClass('is-visible');
			} else {
				$('.navbar').removeClass('is-visible is-fixed');
			}
		} else {
			$('.navbar').removeClass('is-visible');
			if (top > winH && !$('.navbar').hasClass('is-fixed')) {
				$('.navbar').addClass('is-fixed');
			}
		}
		this.previousTop = top;
	})

})