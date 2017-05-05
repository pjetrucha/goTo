/*
 * goTo - smooth, non-expensive way to scrolling elements using rAF
 * https://github.com/pjetrucha/goTo
 *
 * @author Piotr Chrobak
 * @license MIT
 */
(function($, window, document){
	"use strict";

	var defaults = {
		el: window,
		to: 0,
		speed: 500,
		calculate: false,
		callback: null,
		listen: true,
		easing: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations){
			return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
		}
	};

	function goTo(opts){

		var config = $.extend({}, defaults, opts);

		/* if `to` equals 0 there's no need to calculate */
		if(config.to !== 0 && config.calculate){
			config.to = Math.min(Math.max(0, config.to), config.el === window ?
				document.documentElement.scrollHeight - window.innerHeight :
				config.el.scrollHeight - config.el.offsetHeight
			);
		}

		var step = 0,
			max = Math.round(Math.max(1, (config.speed / 16.666))),
			from = getPos(),
			stopped = false,
			setPos = config.el === window ? function(pos){
				window.scrollTo(0, pos);
			} : function(pos){
				config.el.scrollTop = pos;
			};

		/* if distance is empty just skip */
		if(from === config.to){
			step = max + 1;
		}
		else if(config.listen){
			$(config.el).one('mousewheel.goTo DOMMouseScroll.goTo', stop);
		}


		function stop(){
			stopped = true;
		}

		function getPos(){
			if(config.el === window){
				if(document.documentElement.scrollTop == 0){
					return document.body.scrollTop;
				}
				else{
					return document.documentElement.scrollTop;
				}
			}
			else return config.el.scrollTop;
		}

		void function loop(){
			if(!stopped && step <= max){
				requestAnimationFrame(loop);
				setPos(config.easing(step, from, -from + config.to, max));
				step++;
			}
			else{
				if(config.listen) $(config.el).off('mousewheel.goTo DOMMouseScroll.goTo');
				if(typeof config.callback == 'function') config.callback.call(config.el, stopped);
			}
		}();

	}

	window.goTo = function(opts){
		new goTo(opts);
	}

	$.fn.goTo = function(opts){
		return this.each(function(){
			new goTo($.extend({}, opts, {el: this}));
		});
	}

})(jQuery, window, document);