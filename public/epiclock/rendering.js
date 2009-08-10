/**
 * epiClock Rendering Engines
 *
 * Copyright (c) 2008 Eric Garside (http://eric.garside.name)
 * Dual licensed under:
 * 	MIT: http://www.opensource.org/licenses/mit-license.php
 *	GPLv3: http://www.opensource.org/licenses/gpl-3.0.html
 */


/**
 * Flip Clock - A retro flip clock!
 *
 * Example useage:
 *	var options = $.extend({}, flip_clock, { Your Configurations Here });
 *	$('#epiClock').epiclock(options);
 */
var flip_clock = {format: 'h{<img src="flip_clock/sep.gif"/>}i{<img src="flip_clock/sep.gif"/>}s a', onRender:function(e, val){
		var digits = val.substring(1) == 'm' ? [val] : val.split('').reverse(),
			last = e.data('last'),
			prefix = last ? 'd' : 's',
			cmp = last ? last.split('').reverse() : [],
			img = $.makeArray(e.children('img')).reverse();
			
		$.each(digits, function(i){
			var x = this+'',i;
			if (x == cmp[i]) return;
			i = img[i] || $('<img/>').prependTo(e);
			i = $(i);
			i.attr({src: 'flip_clock/' + prefix + x + '.gif', ref: 'flip_clock/s' + x + '.gif'});
			setTimeout(function(){i.attr('src', i.attr('ref'))}, 350)
		})
	}
}
