export abstract class Interpolant {
	parameterPositions: any
	samplesValues: any
	valueSize: f32
	resultBuffer: any
	_cachedIndex: f32

	settings: null // optional, subclass-specific settings structure
	// Note: The indirection allows central control of many interpolants.

	// --- Protected interface
	DefaultSettings_: {}

	getSettings_() {
		return this.settings || this.DefaultSettings_
	}

	beforeStart_ = this.copySampleValue_

	//( N-1, tN-1, t ), returns this.resultBuffer
	afterEnd_ = this.copySampleValue_

	constructor(parameterPositions: any, samplesValues: any, sampleSize: f32, resultBuffer?: any) {
		this.parameterPositions = parameterPositions
		this._cachedIndex = 0

		this.resultBuffer = resultBuffer !== undefined ? resultBuffer : new samplesValues.constructor(sampleSize)
		this.samplesValues = samplesValues
		this.valueSize = sampleSize
	}

	evaluate(time: f32): any {
		const parameterPositions = this.parameterPositions
		let cachedIndex1 = this._cachedIndex,
			t1 = parameterPositions[cachedIndex1],
			t0 = parameterPositions[cachedIndex1 - 1]

		validate_interval: {
			seek: {
				let right

				linear_scan: {
					//- See http://jsperf.com/comparison-to-undefined/3
					//- slower code:
					//-
					//- 				if ( t >= t1 || t1 === undefined ) {
					forward_scan: if (!(time < t1)) {
						for (let giveUpAt = cachedIndex1 + 2; ; ) {
							if (t1 === undefined) {
								if (time < t0) break forward_scan

								// after end

								cachedIndex1 = parameterPositions.length
								this._cachedIndex = cachedIndex1
								return this.afterEnd_(cachedIndex1 - 1, time, t0)
							}

							if (cachedIndex1 === giveUpAt) break // this loop

							t0 = t1
							t1 = parameterPositions[++cachedIndex1]

							if (time < t1) {
								// we have arrived at the sought interval
								break seek
							}
						}

						// prepare binary search on the right side of the index
						right = parameterPositions.length
						break linear_scan
					}

					//- slower code:
					//-					if ( t < t0 || t0 === undefined ) {
					if (!(time >= t0)) {
						// looping?

						const t1global = parameterPositions[1]

						if (time < t1global) {
							cachedIndex1 = 2 // + 1, using the scan for the details
							t0 = t1global
						}

						// linear reverse scan

						for (let giveUpAt = cachedIndex1 - 2; ; ) {
							if (t0 === undefined) {
								// before start

								this._cachedIndex = 0
								return this.beforeStart_(0, time, t1)
							}

							if (cachedIndex1 === giveUpAt) break // this loop

							t1 = t0
							t0 = parameterPositions[--cachedIndex1 - 1]

							if (time >= t0) {
								// we have arrived at the sought interval
								break seek
							}
						}

						// prepare binary search on the left side of the index
						right = cachedIndex1
						cachedIndex1 = 0
						break linear_scan
					}

					// the interval is valid

					break validate_interval
				} // linear scan

				// binary search

				while (cachedIndex1 < right) {
					const mid: f32 = (cachedIndex1 + right) >>> 1

					if (time < parameterPositions[mid]) {
						right = mid
					} else {
						cachedIndex1 = mid + 1
					}
				}

				t1 = parameterPositions[cachedIndex1]
				t0 = parameterPositions[cachedIndex1 - 1]

				// check boundary cases, again

				if (t0 === undefined) {
					this._cachedIndex = 0
					return this.beforeStart_(0, time, t1)
				}

				if (t1 === undefined) {
					cachedIndex1 = parameterPositions.length
					this._cachedIndex = cachedIndex1
					return this.afterEnd_(cachedIndex1 - 1, t0, time)
				}
			} // seek

			this._cachedIndex = cachedIndex1

			this.intervalChanged_(cachedIndex1, t0, t1)
		} // validate_interval

		return this.interpolate_(cachedIndex1, t0, time, t1)
	}

	copySampleValue_(index: f32, two: f32, three: f32) {
		// copies a sample value to the result buffer

		const result = this.resultBuffer,
			values = this.samplesValues,
			stride = this.valueSize,
			offset = index * stride

		for (let i = 0; i !== stride; ++i) {
			result[i] = values[offset + i]
		}

		return result
	}

	// Template methods for derived classes:

	interpolate_(i1: f32, t0: f32, t: f32, t1: f32) {
		throw new Error('call to abstract method')
		// implementations shall return this.resultBuffer
	}

	intervalChanged_(i1: f32, t0: f32, t1: f32) {
		// empty
	}
}
