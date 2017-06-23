# goTo

Function allows to scroll elements on page in a smooth, non-expensive way using rAF. ~~By now it can scroll only verticaly in both direction.~~ It supports both X and Y directions.

---

## Syntax

`goTo([options])`

or

`$(el).goTo([options])`

### Parameters

- `options` [*Optional*] - An object with additional parameters.
   - `el` [*default: window*] - HTMLObject to scroll. If method is used on a jQuery object this value will be filled automatically.
   - `to` [*default: {x: null, y: null}*] - Position to which method should scroll. It accepts also `Number` which became `{x: null, y: Number}`. `Null` means function should not update this scrollTop/Left value. If there's equality `x == y == null`, `to` became `{x: null, y: 0}`.
   - `calculate` [*default: false*] - If *true* plugin will calculate min and max value to which it can scroll smoothly.
   - `callback` [*default: null*] - Function to call when scrolling will end. It provides one argument (boolean) which determinates if animation was interupt by users' mousewheel. Callback (if sets) will call always.
   - `listen` [*default: true*] - Determine if function should listen users' mousewheel event to interupt scrolling process.
   - `easing` [*default: function easeOutCubic*] - Optional easing function.

### Return value

`undefined` or `jQuery collection`

---

## Examples

### #1

```
goTo({
	speed: 1000,
	callback: function(){
		console.log('done');
	}
});
```
&nbsp;
```
$(el).goTo({
	to: 100,
	callback: function(){
		console.log('done');
	}
});
```
&nbsp;
```
$(el).goTo({
	to: {x: 100, y: 200},
	callback: function(){
		console.log('done');
	}
});
```

> **Note:** Callback will call immediately if start and end position of scrolling is same.

### #2

```
$(el).goTo({
	callback: function(interupt){
		if(interupt){
			/* User scrolled his mousewheel */
			return;
		}

		/* Scrolling animation perform without interupt */
	}
});
```

### #3

Lets say we have page with scrollHeight equals 1000px. If we doesn't know that value, and we want to scroll to the end of that page in 1 second, we can set `to` to some large Integer like for example 999999. But this will result in bad experience, beacuse default the `goTo` function will not calculate max value it can scroll. So in this example it will try to scroll 999999px in 1 second, but effect on page will be visible only for 1000px (scrollHeight) in ~1ms (1000/999999 part of second) and the rest of time (~999ms - before callback occures) there will be no visual effect. To prevent this situation you can set `calculate: true` and then function will be calculate the min and the max value before scrolling animation occure.
> **Note:** 999999 is only example value and in some case it can be not enough, so you can set `Infinity` but remember to set `calculate: true` also :)

```
goTo({
	to: Infinity,
	speed: 1000,
	calculate: true,
	callback: function(){
		console.log('done');
	}
});
```

---

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
