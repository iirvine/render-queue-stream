var Writable = require('stream').Writable;

module.exports = function(fn) {
	var rate = 500,
		queue = [],
		threshold = rate * 100,
		requestID = null,
		stream = Writable({ objectMode: true });

	stream.on('finish', onFinish);
	stream.once('queued', render);

	stream._write = function(chunk, endcoding, cb) {
		queue = queue.concat([chunk])
		stream.emit('queued')
		cb()
	}

	stream.rate = function(_) {
		if (!arguments.length) return rate;
		rate = _;
		return stream;
	}

	stream.threshold = function(_) {
		if (!arguments.length) return threshold;
		threshold = _;
		return stream;
	}
	
	stream.remaining = function() {
		return queue.length;
	}

	function render() {
		fn(queue.splice(0, rate))
		requestID = requestFrame(render)
	}

	function clearQueue() {
		// all of our data is queued now, so let's whittle away at it until it's small
		// enough that we can add whatever's left in one go
		if (queue.length <= threshold) {
			if (requestID) cancelFrame(requestID)
			return fn(queue)
		}
		fn(queue.splice(0, rate))
		requestID = requestFrame(clearQueue)
	}
	
	function onFinish() {
		if (requestID) cancelFrame(requestID)
		if (queue.length) clearQueue()		 
	}

	var requestFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame
		|| function(callback) { setTimeout(callback, 17); };

	var cancelFrame = window.cancelAnimationFrame
		|| function(id) { clearTimeout(id); };

	return stream;
}