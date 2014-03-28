# renderqueue-stream

In short, a streamable version of [Kai Chang's render-queue.js](http://bl.ocks.org/syntagmatic/raw/3341641/). 

```js
var RenderQueue = require('renderqueue-stream');	
var someStreamOfData = require('./MyStream');

someStreamOfData.pipe(RenderQueue(function(data) { render(data); }).rate(50));

function render(data) {
	// do something to render small chunks of data to screen
}
```

## api

### `RenderQueue(fn)`

Creates a writable stream. When data is written to the stream a render loop will begin that will
invoke `fn` with `rate` slices of data per frame via `requestAnimationFrame` to keep the page responsive.

### `stream.rate(num)`

Get or set the number of data entries to be rendered each frame.

### `stream.remaining()`

Returns current length of the animation queue.