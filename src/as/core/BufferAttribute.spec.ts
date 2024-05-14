/**
 * @author simonThiele / https://github.com/simonThiele
 * @author corruptedzulu / https://github.com/corruptedzulu
 * @author Joe Pea / https://github.com/trusktr
 */

import { BufferAttribute, ArrayType, Int8BufferAttribute } from './BufferAttribute'
import { Color } from '../math/Color'
import { Vector2 } from '../math/Vector2'
import { Vector3 } from '../math/Vector3'
import { Vector4 } from '../math/Vector4'

let uploadCallbackCalled = false

describe('BufferAttributeCore', () => {
	describe('BufferAttribute', () => {
		test('constructor', () => {
			expect(function () {
				new BufferAttribute(ArrayType.Int8, 5, 2, false)
			}).not.toThrow()
		})

		// PROPERTIES
		todo('needsUpdate')

		// PUBLIC STUFF
		todo('isBufferAttribute')

		// test('setArray', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4])
		// 	var a = new BufferAttribute(f32a, 2, false)

		// 	a.setArray(f32a, 2)

		// 	assert.strictEqual(a.count, 2, 'Check item count')
		// 	assert.strictEqual(a.array, f32a, 'Check array')

		// 	assert.throws(
		// 		function() {
		// 			a.setArray([1, 2, 3, 4])
		// 		},
		// 		/array should be a Typed Array/,
		// 		'Calling setArray with a simple array throws Error'
		// 	)
		// })

		todo('setDynamic')

		// test('copy', () => {
		// 	var attr = new BufferAttribute(new Float32Array([1, 2, 3, 4, 5, 6]), 3)
		// 	attr.setDynamic(true)
		// 	attr.needsUpdate = true

		// 	var attrCopy = new BufferAttribute().copy(attr)

		// 	assert.ok(attr.count === attrCopy.count, 'count is equal')
		// 	assert.ok(attr.itemSize === attrCopy.itemSize, 'itemSize is equal')
		// 	assert.ok(attr.dynamic === attrCopy.dynamic, 'dynamic is equal')
		// 	assert.ok(attr.array.length === attrCopy.array.length, 'array length is equal')
		// 	assert.ok(attr.version === 1 && attrCopy.version === 0, 'version is not copied which is good')
		// })

		// test('copyAt', () => {
		// 	var attr = new BufferAttribute(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 3)
		// 	var attr2 = new BufferAttribute(new Float32Array(9), 3)

		// 	attr2.copyAt(1, attr, 2)
		// 	attr2.copyAt(0, attr, 1)
		// 	attr2.copyAt(2, attr, 0)

		// 	var i = attr.array
		// 	var i2 = attr2.array // should be [4, 5, 6, 7, 8, 9, 1, 2, 3]

		// 	assert.ok(i2[0] === i[3] && i2[1] === i[4] && i2[2] === i[5], 'chunck copied to correct place')
		// 	assert.ok(i2[3] === i[6] && i2[4] === i[7] && i2[5] === i[8], 'chunck copied to correct place')
		// 	assert.ok(i2[6] === i[0] && i2[7] === i[1] && i2[8] === i[2], 'chunck copied to correct place')
		// })

		test('copyArray, Int8', () => {
			let a = new Int8Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Int8, 2, 2, false)
			attr.arrays.Int8[0] = 5
			attr.arrays.Int8[1] = 6
			attr.arrays.Int8[2] = 7
			attr.arrays.Int8[3] = 8

			const a2 = attr.arrays.Int8

			attr.copyArray(a)

			expect(attr.arrays.Int8).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Int8).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Int8).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Uint8', () => {
			let a = new Uint8Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Uint8, 2, 2, false)
			attr.arrays.Uint8[0] = 5
			attr.arrays.Uint8[1] = 6
			attr.arrays.Uint8[2] = 7
			attr.arrays.Uint8[3] = 8

			const a2 = attr.arrays.Uint8

			attr.copyArray(a)

			expect(attr.arrays.Uint8).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Uint8).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Uint8).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Uint8Clamped', () => {
			let a = new Uint8ClampedArray(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Uint8Clamped, 2, 2, false)
			attr.arrays.Uint8Clamped[0] = 5
			attr.arrays.Uint8Clamped[1] = 6
			attr.arrays.Uint8Clamped[2] = 7
			attr.arrays.Uint8Clamped[3] = 8

			const a2 = attr.arrays.Uint8Clamped

			attr.copyArray(a)

			expect(attr.arrays.Uint8Clamped).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Uint8Clamped).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Uint8Clamped).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Int16', () => {
			let a = new Int16Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Int16, 2, 2, false)
			attr.arrays.Int16[0] = 5
			attr.arrays.Int16[1] = 6
			attr.arrays.Int16[2] = 7
			attr.arrays.Int16[3] = 8

			const a2 = attr.arrays.Int16

			attr.copyArray(a)

			expect(attr.arrays.Int16).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Int16).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Int16).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Uint16', () => {
			let a = new Uint16Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Uint16, 2, 2, false)
			attr.arrays.Uint16[0] = 5
			attr.arrays.Uint16[1] = 6
			attr.arrays.Uint16[2] = 7
			attr.arrays.Uint16[3] = 8

			const a2 = attr.arrays.Uint16

			attr.copyArray(a)

			expect(attr.arrays.Uint16).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Uint16).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Uint16).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Int32', () => {
			let a = new Int32Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Int32, 2, 2, false)
			attr.arrays.Int32[0] = 5
			attr.arrays.Int32[1] = 6
			attr.arrays.Int32[2] = 7
			attr.arrays.Int32[3] = 8

			const a2 = attr.arrays.Int32

			attr.copyArray(a)

			expect(attr.arrays.Int32).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Int32).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Int32).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Uint32', () => {
			let a = new Uint32Array(4)
			a[0] = 1
			a[1] = 2
			a[2] = 3
			a[3] = 4

			const attr = new BufferAttribute(ArrayType.Uint32, 2, 2, false)
			attr.arrays.Uint32[0] = 5
			attr.arrays.Uint32[1] = 6
			attr.arrays.Uint32[2] = 7
			attr.arrays.Uint32[3] = 8

			const a2 = attr.arrays.Uint32

			attr.copyArray(a)

			expect(attr.arrays.Uint32).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Uint32).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Uint32).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Float32', () => {
			let a = new Float32Array(4)
			a[0] = 1.0
			a[1] = 2.0
			a[2] = 3.0
			a[3] = 4.0

			const attr = new BufferAttribute(ArrayType.Float32, 2, 2, false)
			attr.arrays.Float32[0] = 5.0
			attr.arrays.Float32[1] = 6.0
			attr.arrays.Float32[2] = 7.0
			attr.arrays.Float32[3] = 8.0

			const a2 = attr.arrays.Float32

			attr.copyArray(a)

			expect(attr.arrays.Float32).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Float32).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Float32).toStrictEqual(a, 'array should have the new values')
		})

		test('copyArray, Float64', () => {
			let a = new Float64Array(4)
			a[0] = 1.0
			a[1] = 2.0
			a[2] = 3.0
			a[3] = 4.0

			const attr = new BufferAttribute(ArrayType.Float64, 2, 2, false)
			attr.arrays.Float64[0] = 5.0
			attr.arrays.Float64[1] = 6.0
			attr.arrays.Float64[2] = 7.0
			attr.arrays.Float64[3] = 8.0

			const a2 = attr.arrays.Float64

			attr.copyArray(a)

			expect(attr.arrays.Float64).toBe(a2, 'array should be same after copy')
			expect(attr.arrays.Float64).not.toBe(a, 'array should not be the same instane')
			expect(attr.arrays.Float64).toStrictEqual(a, 'array should have the new values')
		})

		test('copyColorsArray with valid args', () => {
			const attr = new BufferAttribute(ArrayType.Float32, 2, 3)

			attr.copyColorsArray([new Color(0, 0.5, 1), new Color(0.25, 1, 0)])

			const i = attr.arrays.Float32
			expect(i[0] === 0 && i[1] === 0.5 && i[2] === 1).toBe(true, 'first color should be copied')
			expect(i[3] === 0.25 && i[4] === 1 && i[5] === 0).toBe(true, 'second color should be copied')
		})

		test('copyColorsArray with invalid args', () => {
			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float32, 3, 2)
				attr.copyColorsArray([new Color(0, 0.5, 1), new Color(0.25, 1, 0)])
			}).toThrow('it should throw if itemSize does not match')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float32, 2, 3)
				attr.copyColorsArray([new Color(0, 0.5, 1), new Color(0.25, 1, 0), new Color(0, 0.5, 1)])
			}).toThrow('it should throw if number of colors is more than fits in the array')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Int32, 2, 3)
				attr.copyColorsArray([new Color(0, 0.5, 1), new Color(0.25, 1, 0)])
			}).toThrow('it should throw if array type does not hold floats')
		})

		test('copyVector2sArray with valid args, Float32', () => {
			copyVector2sArrayTest(ArrayType.Float32)
		})

		test('copyVector2sArray with valid args, Float64', () => {
			copyVector2sArrayTest(ArrayType.Float64)
		})

		test('copyVector2sArray with invalid args', () => {
			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float32, 2, 3)
				attr.copyVector2sArray([new Vector2(0, 0.5), new Vector2(0.25, 1)])
			}).toThrow('it should throw if itemSize does not match')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float64, 2, 2)
				attr.copyVector2sArray([new Vector2(0, 0.5), new Vector2(0.25, 1), new Vector2(0, 0.5)])
			}).toThrow('it should throw if number of vectors is more than fits in the array')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Int32, 2, 2)
				attr.copyVector2sArray([new Vector2(0, 0.5), new Vector2(0.25, 1)])
			}).toThrow('it should throw if array type does not hold floats')
		})

		test('copyVector3sArray with valid args', () => {
			const attr = new BufferAttribute(ArrayType.Float32, 2, 3)

			attr.copyVector3sArray([new Vector3(1, 2, 3), new Vector3(10, 20, 30)])

			const i = attr.arrays.Float32
			expect(i[0] === 1 && i[1] === 2 && i[2] === 3).toBe(true, 'first vector should be copied')
			expect(i[3] === 10 && i[4] === 20 && i[5] === 30).toBe(true, 'second vector should be copied')
		})

		test('copyVector3sArray with invalid args', () => {
			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float32, 3, 2)
				attr.copyVector3sArray([new Vector3(0, 0.5, 1), new Vector3(0.25, 1, 0)])
			}).toThrow('it should throw if itemSize does not match')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Float64, 2, 3)
				attr.copyVector3sArray([new Vector3(0, 0.5, 1), new Vector3(0.25, 1, 0), new Vector3(0, 0.5, 1)])
			}).toThrow('it should throw if number of vectors is more than fits in the array')

			expect(function () {
				const attr = new BufferAttribute(ArrayType.Int16, 2, 3)
				attr.copyVector3sArray([new Vector3(0, 0.5, 1), new Vector3(0.25, 1, 0)])
			}).toThrow('it should throw if array type does not hold floats')
		})

		// test('copyVector4sArray', () => {
		// 	var attr = new BufferAttribute(new Float32Array(8), 2)

		// 	attr.copyVector4sArray([new Vector4(1, 2, 3, 4), new Vector4(10, 20, 30, 40)])

		// 	var i = attr.array
		// 	assert.ok(i[0] === 1 && i[1] === 2 && i[2] === 3 && i[3] === 4, 'first vector was copied correctly')
		// 	assert.ok(i[4] === 10 && i[5] === 20 && i[6] === 30 && i[7] === 40, 'second vector was copied correctly')
		// })

		// test('set', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4])
		// 	var a = new BufferAttribute(f32a, 2, false)
		// 	var expected = new Float32Array([9, 2, 8, 4])

		// 	a.set([9])
		// 	a.set([8], 2)

		// 	assert.deepEqual(a.array, expected, 'Check array has expected values')
		// })

		// test('set[X, Y, Z, W, XYZ, XYZW]/get[X, Y, Z, W]', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8])
		// 	var a = new BufferAttribute(f32a, 4, false)
		// 	var expected = new Float32Array([1, 2, -3, -4, -5, -6, 7, 8])

		// 	a.setX(1, a.getX(1) * -1)
		// 	a.setY(1, a.getY(1) * -1)
		// 	a.setZ(0, a.getZ(0) * -1)
		// 	a.setW(0, a.getW(0) * -1)

		// 	assert.deepEqual(a.array, expected, 'Check all set* calls set the correct values')
		// })

		// test('setXY', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4])
		// 	var a = new BufferAttribute(f32a, 2, false)
		// 	var expected = new Float32Array([-1, -2, 3, 4])

		// 	a.setXY(0, -1, -2)

		// 	assert.deepEqual(a.array, expected, 'Check for the correct values')
		// })

		// test('setXYZ', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4, 5, 6])
		// 	var a = new BufferAttribute(f32a, 3, false)
		// 	var expected = new Float32Array([1, 2, 3, -4, -5, -6])

		// 	a.setXYZ(1, -4, -5, -6)

		// 	assert.deepEqual(a.array, expected, 'Check for the correct values')
		// })

		// test('setXYZW', () => {
		// 	var f32a = new Float32Array([1, 2, 3, 4])
		// 	var a = new BufferAttribute(f32a, 4, false)
		// 	var expected = new Float32Array([-1, -2, -3, -4])

		// 	a.setXYZW(0, -1, -2, -3, -4)

		// 	assert.deepEqual(a.array, expected, 'Check for the correct values')
		// })

		test('onUpload', () => {
			let a = new Int8BufferAttribute(2, 3)

			const func = function (): void {
				uploadCallbackCalled = true
			}

			a.onUpload(func)

			expect(a.onUploadCallback).toStrictEqual(func, 'callback function should be assigned')

			// TODO ...upload data to GPU...

			// TODO test that function was called after data was uploaded.
			// expect(uploadCallbackCalled).toBe(true)
		})

		// test('clone', () => {
		// 	var attr = new BufferAttribute(new Float32Array([1, 2, 3, 4, 0.12, -12]), 2)
		// 	var attrCopy = attr.clone()

		// 	assert.ok(attr.array.length === attrCopy.array.length, 'attribute was cloned')
		// 	for (var i = 0; i < attr.array.length; i++) {
		// 		assert.ok(attr.array[i] === attrCopy.array[i], 'array item is equal')
		// 	}
		// })

		// // OTHERS
		// test('count', () => {
		// 	assert.ok(
		// 		new BufferAttribute(new Float32Array([1, 2, 3, 4, 5, 6]), 3).count === 2,
		// 		'count is equal to the number of chunks'
		// 	)
		// })
	})

	describe('Int8BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Uint8BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Uint8ClampedBufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Int16BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Uint16BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Int32BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Uint32BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Float32BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})

	describe('Float64BufferAttribute', () => {
		// INHERITANCE
		todo('Extending')

		// INSTANCING
		todo('Instancing')
	})
})

function copyVector2sArrayTest(type: ArrayType): void {
	const attr = new BufferAttribute(type, 2, 2)

	attr.copyVector2sArray([new Vector2(1, 2), new Vector2(4, 5)])

	if (type == ArrayType.Float32) {
		const i = attr.arrays.Float32
		expect(i[0] === 1 && i[1] === 2).toBe(true, 'first vector should be copied')
		expect(i[2] === 4 && i[3] === 5).toBe(true, 'second vector should be copied')
	} else if (type == ArrayType.Float64) {
		const a = attr.arrays.Float64
		expect(a[0] === 1 && a[1] === 2).toBe(true, 'first vector should be copied')
		expect(a[2] === 4 && a[3] === 5).toBe(true, 'second vector should be copied')
	}
}
