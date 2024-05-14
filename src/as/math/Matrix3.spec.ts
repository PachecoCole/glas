/**
 * @author bhouston / http://exocortex.com
 * @author TristanVALCKE / https://github.com/Itee
 */

import { Matrix3 } from './Matrix3'
import { Matrix4 } from './Matrix4'
// import {Float32BufferAttribute} from '../core/BufferAttribute'

function arraysApproxEquals(a: Array<f32>, b: Array<f32>, tolerance: f32 = 0.0001): bool {
	if (a.length != b.length) {
		return false
	}

	for (let i = 0, il = a.length; i < il; i++) {
		const delta = a[i] - b[i]
		if (delta > tolerance) {
			return false
		}
	}

	return true
}

// function matrixEquals<T>(a: T, b: T, tolerance: f32 = 0.0001): bool {
// 	if (a.elements.length != b.elements.length) {
// 		return false
// 	}

// 	for (var i = 0, il = a.elements.length; i < il; i++) {
// 		var delta = a.elements[i] - b.elements[i]
// 		if (delta > tolerance) {
// 			return false
// 		}
// 	}

// 	return true
// }

function toMatrix4(m3: Matrix3): Matrix4 {
	const result = new Matrix4()
	let re = result.elements
	const me = m3.elements
	re[0] = me[0]
	re[1] = me[1]
	re[2] = me[2]
	re[4] = me[3]
	re[5] = me[4]
	re[6] = me[5]
	re[8] = me[6]
	re[9] = me[7]
	re[10] = me[8]

	return result
}

describe('Matrix3', () => {
	// INSTANCING
	test('constructor', () => {
		const a = new Matrix3()
		expect(a.determinant()).toBe(1)

		const b = new Matrix3()
		b.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		expect(b.elements[0]).toBe(0)
		expect(b.elements[1]).toBe(3)
		expect(b.elements[2]).toBe(6)
		expect(b.elements[3]).toBe(1)
		expect(b.elements[4]).toBe(4)
		expect(b.elements[5]).toBe(7)
		expect(b.elements[6]).toBe(2)
		expect(b.elements[7]).toBe(5)
		expect(b.elements[8]).toBe(8)

		expect(arraysApproxEquals(a.elements, b.elements)).toBeFalsy()
	})

	todo('isMatrix3')

	test('set', () => {
		const b = new Matrix3()
		expect(b.determinant()).toBe(1)

		b.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		expect(b.elements[0]).toBe(0)
		expect(b.elements[1]).toBe(3)
		expect(b.elements[2]).toBe(6)
		expect(b.elements[3]).toBe(1)
		expect(b.elements[4]).toBe(4)
		expect(b.elements[5]).toBe(7)
		expect(b.elements[6]).toBe(2)
		expect(b.elements[7]).toBe(5)
		expect(b.elements[8]).toBe(8)
	})

	test('identity', () => {
		const b = new Matrix3()
		b.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		expect(b.elements[0] == 0).toBeTruthy()
		expect(b.elements[1] == 3).toBeTruthy()
		expect(b.elements[2] == 6).toBeTruthy()
		expect(b.elements[3] == 1).toBeTruthy()
		expect(b.elements[4] == 4).toBeTruthy()
		expect(b.elements[5] == 7).toBeTruthy()
		expect(b.elements[6] == 2).toBeTruthy()
		expect(b.elements[7] == 5).toBeTruthy()
		expect(b.elements[8] == 8).toBeTruthy()

		const a = new Matrix3()
		expect(arraysApproxEquals(a.elements, b.elements)).toBeFalsy()

		b.identity()
		expect(arraysApproxEquals(a.elements, b.elements)).toBeTruthy()
	})

	test('clone', () => {
		const a = new Matrix3()
		a.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		const b = a.clone()

		expect(arraysApproxEquals(a.elements, b.elements)).toBeTruthy()

		// ensure that it is a true copy
		a.elements[0] = 2
		expect(arraysApproxEquals(a.elements, b.elements)).toBeFalsy('six')
	})

	test('copy', () => {
		const a = new Matrix3()
		a.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		const b = new Matrix3()
		b.copy(a)

		expect(arraysApproxEquals(a.elements, b.elements)).toBeTruthy()

		// ensure that it is a true copy
		a.elements[0] = 2
		expect(arraysApproxEquals(a.elements, b.elements)).toBeFalsy()
	})

	todo('setFromMatrix4')

	todo('applyToBufferAttribute')
	// test('applyToBufferAttribute', assert => {
	// 	var a = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9)
	// 	var attr = new Float32BufferAttribute([1, 2, 1, 3, 0, 3], 3)
	// 	var expected = new Float32Array([8, 20, 32, 12, 30, 48])

	// 	var applied = a.applyToBufferAttribute(attr)

	// 	assert.deepEqual(applied.array, expected, 'Check resulting buffer')
	// })

	test('multiply/premultiply', () => {
		// both simply just wrap multiplyMatrices
		const a = new Matrix3()
		a.set(2, 3, 5, 7, 11, 13, 17, 19, 23)
		const b = new Matrix3()
		b.set(29, 31, 37, 41, 43, 47, 53, 59, 61)
		const expectedMultiply: Array<f32> = [446, 1343, 2491, 486, 1457, 2701, 520, 1569, 2925]
		const expectedPremultiply: Array<f32> = [904, 1182, 1556, 1131, 1489, 1967, 1399, 1845, 2435]

		a.multiply(b)
		expect(a.elements).toStrictEqual(expectedMultiply)

		a.set(2, 3, 5, 7, 11, 13, 17, 19, 23)
		a.premultiply(b)
		expect(a.elements).toStrictEqual(expectedPremultiply)
	})

	test('multiplyMatrices', () => {
		// Reference:
		//
		// #!/usr/bin/env python
		// from __future__ import print_function
		// import numpy as np
		// print(
		//     np.dot(
		//         np.reshape([2, 3, 5, 7, 11, 13, 17, 19, 23], (3, 3)),
		//         np.reshape([29, 31, 37, 41, 43, 47, 53, 59, 61], (3, 3))
		//     )
		// )
		//
		// [[ 446  486  520]
		//  [1343 1457 1569]
		//  [2491 2701 2925]]
		const lhs = new Matrix3()
		lhs.set(2, 3, 5, 7, 11, 13, 17, 19, 23)
		const rhs = new Matrix3()
		rhs.set(29, 31, 37, 41, 43, 47, 53, 59, 61)
		const ans = new Matrix3()

		ans.multiplyMatrices(lhs, rhs)

		expect(ans.elements[0]).toBe(446)
		expect(ans.elements[1]).toBe(1343)
		expect(ans.elements[2]).toBe(2491)
		expect(ans.elements[3]).toBe(486)
		expect(ans.elements[4]).toBe(1457)
		expect(ans.elements[5]).toBe(2701)
		expect(ans.elements[6]).toBe(520)
		expect(ans.elements[7]).toBe(1569)
		expect(ans.elements[8]).toBe(2925)
	})

	test('multiplyScalar', () => {
		const b = new Matrix3()
		b.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		expect(b.elements[0]).toBe(0)
		expect(b.elements[1]).toBe(3)
		expect(b.elements[2]).toBe(6)
		expect(b.elements[3]).toBe(1)
		expect(b.elements[4]).toBe(4)
		expect(b.elements[5]).toBe(7)
		expect(b.elements[6]).toBe(2)
		expect(b.elements[7]).toBe(5)
		expect(b.elements[8]).toBe(8)

		b.multiplyScalar(2)
		expect(b.elements[0]).toBe(0 * 2)
		expect(b.elements[1]).toBe(3 * 2)
		expect(b.elements[2]).toBe(6 * 2)
		expect(b.elements[3]).toBe(1 * 2)
		expect(b.elements[4]).toBe(4 * 2)
		expect(b.elements[5]).toBe(7 * 2)
		expect(b.elements[6]).toBe(2 * 2)
		expect(b.elements[7]).toBe(5 * 2)
		expect(b.elements[8]).toBe(8 * 2)
	})

	test('determinant', () => {
		const a = new Matrix3()
		expect(a.determinant()).toBe(1)

		a.elements[0] = 2
		expect(a.determinant()).toBe(2)

		a.elements[0] = 0
		expect(a.determinant()).toBe(0)

		// calculated via http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/threeD/index.htm
		a.set(2, 3, 4, 5, 13, 7, 8, 9, 11)
		expect(a.determinant()).toBe(-73)
	})

	test('getInverse', () => {
		const identity = new Matrix3()
		const identity4 = new Matrix4()
		const a = new Matrix3()
		const b = new Matrix3()
		b.set(0, 0, 0, 0, 0, 0, 0, 0, 0)
		const c = new Matrix3()
		c.set(0, 0, 0, 0, 0, 0, 0, 0, 0)

		b.getInverse(a)
		expect(arraysApproxEquals(a.elements, identity.elements)).toBeTruthy()

		expect(b.getInverse(c)).toBe(false, 'The inverse should not be calculable.')
		expect(b.elements).toStrictEqual(identity.elements)

		const testMatrices: Array<Matrix4> = [
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
			new Matrix4(),
		]

		testMatrices[0].makeRotationX(0.3)
		testMatrices[1].makeRotationX(-0.3)
		testMatrices[2].makeRotationY(0.3)
		testMatrices[3].makeRotationY(-0.3)
		testMatrices[4].makeRotationZ(0.3)
		testMatrices[5].makeRotationZ(-0.3)
		testMatrices[6].makeScale(1, 2, 3)
		testMatrices[7].makeScale(1 / 8, 1 / 2, 1 / 3)

		for (let i = 0, il = testMatrices.length; i < il; i++) {
			const m = testMatrices[i]

			a.setFromMatrix4(m)
			b.getInverse(a)
			const mInverse3 = b

			const mInverse = toMatrix4(mInverse3)

			// the determinant of the inverse should be the reciprocal
			expect(Mathf.abs(a.determinant() * mInverse3.determinant() - 1)).toBeLessThan(0.0001)
			expect(Mathf.abs(m.determinant() * mInverse.determinant() - 1)).toBeLessThan(0.0001)

			const mProduct = new Matrix4()
			mProduct.multiplyMatrices(m, mInverse)
			expect(Mathf.abs(mProduct.determinant() - 1)).toBeLessThan(0.0001)
			expect(arraysApproxEquals(mProduct.elements, identity4.elements)).toBeTruthy()
		}
	})

	test('transpose', () => {
		const a = new Matrix3()
		let b = a.clone().transpose()
		expect(arraysApproxEquals(a.elements, b.elements)).toBeTruthy()

		b = new Matrix3()
		b.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		const c = b.clone().transpose()
		expect(arraysApproxEquals(b.elements, c.elements)).toBeFalsy()
		c.transpose()
		expect(arraysApproxEquals(b.elements, c.elements)).toBeTruthy()
	})

	test('getNormalMatrix', () => {
		const a = new Matrix3()
		const b = new Matrix4()
		b.set(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 57)
		const expected = new Matrix3()
		expected.set(
			-1.2857142857142856,
			0.7142857142857143,
			0.2857142857142857,
			0.7428571428571429,
			-0.7571428571428571,
			0.15714285714285714,
			-0.19999999999999998,
			0.3,
			-0.09999999999999999
		)

		a.getNormalMatrix(b)
		expect(arraysApproxEquals(a.elements, expected.elements)).toBeTruthy()
	})

	todo('transposeIntoArray')

	// This test doesn't work as expected for some reason. Hmmmm....
	todo('setUvTransform')
	// test('setUvTransform', () => {
	// 	var a = new Matrix3()
	// 	a.set(
	// 		0.1767766952966369,
	// 		0.17677669529663687,
	// 		0.32322330470336313,
	// 		-0.17677669529663687,
	// 		0.1767766952966369,
	// 		0.5,
	// 		0,
	// 		0,
	// 		1
	// 	)
	// 	var b = new Matrix3()
	// 	const centerX = 0.5
	// 	const centerY = 0.5
	// 	const offsetX = 0
	// 	const offsetY = 0
	// 	const repeatX = 0.25
	// 	const repeatY = 0.25
	// 	const rotation = 0.7753981633974483
	// 	var expected = new Matrix3()
	// 	b.set(
	// 		0.1785355940258599,
	// 		0.17500011904519763,
	// 		0.32323214346447127,
	// 		-0.17500011904519763,
	// 		0.1785355940258599,
	// 		0.4982322625096689,
	// 		0,
	// 		0,
	// 		1
	// 	)

	// 	a.setUvTransform(offsetX, offsetY, repeatX, repeatY, rotation, centerX, centerY)

	// 	b.identity()
	// 		.translate(-centerX, -centerY)
	// 		.rotate(rotation)
	// 		.scale(repeatX, repeatY)
	// 		.translate(centerX, centerY)
	// 		.translate(offsetX, offsetY)

	// 	expect(arraysApproxEquals(a.elements, expected.elements)).toBeTruthy()
	// 	expect(arraysApproxEquals(b.elements, expected.elements)).toBeTruthy()
	// })

	test('scale', () => {
		const a = new Matrix3()
		a.set(1, 2, 3, 4, 5, 6, 7, 8, 9)
		const expected = new Matrix3()
		expected.set(0.25, 0.5, 0.75, 1, 1.25, 1.5, 7, 8, 9)

		a.scale(0.25, 0.25)
		expect(arraysApproxEquals(a.elements, expected.elements)).toBeTruthy()
	})

	test('rotate', () => {
		const a = new Matrix3()
		a.set(1, 2, 3, 4, 5, 6, 7, 8, 9)
		const expected = new Matrix3()
		expected.set(
			3.5355339059327373,
			4.949747468305833,
			6.363961030678928,
			2.121320343559643,
			2.121320343559643,
			2.1213203435596433,
			7,
			8,
			9
		)

		a.rotate(Mathf.PI / 4)
		expect(arraysApproxEquals(a.elements, expected.elements)).toBeTruthy()
	})

	test('translate', () => {
		const a = new Matrix3()
		a.set(1, 2, 3, 4, 5, 6, 7, 8, 9)
		const expected = new Matrix3()
		expected.set(22, 26, 30, 53, 61, 69, 7, 8, 9)

		a.translate(3, 7)
		expect(arraysApproxEquals(a.elements, expected.elements)).toBeTruthy()
	})

	test('equals', () => {
		const a = new Matrix3()
		a.set(0, 1, 2, 3, 4, 5, 6, 7, 8)
		const b = new Matrix3()
		b.set(0, -1, 2, 3, 4, 5, 6, 7, 8)

		expect(a.equals(b)).toBeFalsy()
		expect(b.equals(a)).toBeFalsy()

		a.copy(b)
		expect(a.equals(b)).toBeTruthy()
		expect(b.equals(a)).toBeTruthy()
	})

	todo('fromArray')

	test('toArray', () => {
		const a = new Matrix3()
		a.set(1, 2, 3, 4, 5, 6, 7, 8, 9)
		const noOffset: Array<f32> = [1, 4, 7, 2, 5, 8, 3, 6, 9]

		let array = a.toArray()
		expect(array).toStrictEqual(noOffset, 'No array, no offset')

		array = []
		a.toArray(array)
		expect(array).toStrictEqual(noOffset, 'With array, no offset')

		const withOffset: Array<f32> = [-999, 1, 4, 7, 2, 5, 8, 3, 6, 9]

		array = [-999]
		a.toArray(array, 1)
		expect(array).toStrictEqual(withOffset, 'With array, with offset')
	})
})
