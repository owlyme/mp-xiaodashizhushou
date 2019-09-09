class Timer {
	constructor(time) {
		this.time = time || 3000
		this.timer = null
	}

	run() {
		if(this.timer !== null) return
		this.timer = setInterval(() => {
			this.fn()
		}, this.time)
	}

	stop() {
		clearInterval(this.timer)
		this.timer = null
	}

	fn() {
		console.log('timer is running')
	}
}

export default Timer