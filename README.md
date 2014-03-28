# render-queue-stream

In short, a streamable version of [Kai Chang's render-queue.js](http://bl.ocks.org/syntagmatic/raw/3341641/). 

```js
var RenderQueue = require('render-queue-stream');	
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

When all of the data is queued, the render loop will continue until the remaining data is below a certain threshold 
(defaults to rate * 100), at which point the render function will be invoked with the remainder of the queue.

### `stream.rate(num)`

Get or set the number of data entries to be rendered each frame.

### `stream.threshold(num)`

Get or set the threshold value. Once all data is queued and the buffer reaches this threshold, the render function 
will be called with the remainder of the queue.

### `stream.remaining()`

Returns current length of the animation queue.