/*
 * goTo - smooth, non-expensive way for scrolling elements using rAF
 * https://github.com/pjetrucha/goTo
 *
 * @author Piotr Chrobak
 * @license MIT
 */
(function($, window, document){
	"use strict";

	var defaults = {
		el: window,
		to: {x: null, y: null},
		speed: 500,
		calculate: false,
		callback: null,
		listen: true,
		easing: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations){
			return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
		}
	};

	function goTo(opts){

		var config = $.extend(true, {}, defaults, opts);

		/* backward compatibility */
		if(typeof config.to === "number"){
			config.to = $.extend({}, defaults.to, {y: config.to});
		}
		else if(config.to.x === null && config.to.y === null){
			config.to.y = 0;
		}

		if(config.calculate){
			/* if `to` equals 0 || null there's no need to calculate */
			if(config.to.x){
				config.to.x = Math.min(Math.max(0, config.to.x), config.el === window ?
					document.documentElement.scrollWidth - window.innerWidth :
					config.el.scrollWidth - config.el.offsetWidth
				);
			}
			if(config.to.y){
				config.to.y = Math.min(Math.max(0, config.to.y), config.el === window ?
					document.documentElement.scrollHeight - window.innerHeight :
					config.el.scrollHeight - config.el.offsetHeight
				);
			}
		}

		var step = 0,
			max = Math.round(Math.max(1, (config.speed / 16.666))),
			from = getPos(),
			stopped = false,
			setPos = config.el === window ? window.scrollTo : function(x, y){
				config.el.scrollLeft = x;
				config.el.scrollTop = y;
			},
			skip = {
				x: config.to.x === null,
				y: config.to.y === null
			};

		/* if distance is empty just skip */
		if(from.x === config.to.x && from.y === config.to.y){
			step = max + 1;
		}
		else if(config.listen){
			$(config.el).one('mousewheel.goTo DOMMouseScroll.goTo', stop);
		}


		function stop(){
			stopped = true;
		}

		function getElement(){
			if(config.el === window){
				if(document.documentElement.scrollTop == 0){
					return document.body;
				}
				else{
					return document.documentElement;
				}
			}
			else return config.el;
		}

		function getPos(){
			var el = getElement();
			return {
				x: el.scrollLeft,
				y: el.scrollTop
			};
		}

		void function loop(){
			if(!stopped && step <= max){
				requestAnimationFrame(loop);
				setPos(
					skip.x ? from.x : config.easing(step, from.x, -from.x + config.to.x, max),
					skip.y ? from.y : config.easing(step, from.y, -from.y + config.to.y, max)
				);
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
