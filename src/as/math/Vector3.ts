/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author corruptedzulu / http://github.com/corruptedzulu
 * @author Joe Pea / http://github.com/trusktr
 */

// import {Quaternion} from './Quaternion'
import * as MathUtils from './MathUtils'
// import {Euler} from './Euler'
import { Matrix3 } from './Matrix3'
import { Matrix4 } from './Matrix4'
// import {Camera} from './../cameras/Camera'
// import {Spherical} from './Spherical'
// import {Cylindrical} from './Cylindrical'
// import {Vector} from './Vector2'
// import {BufferAttribute} from '../core/BufferAttribute'

/**
 * 3D vector.
 *
 * @example
 * const a = new THREE.Vector3( 1, 0, 0 );
 * const b = new THREE.Vector3( 0, 1, 0 );
 * const c = new THREE.Vector3();
 * c.crossVectors( a, b );
 *
 * @see <a href="https://github.com/mrdoob/three.js/blob/master/src/math/Vector3">src/math/Vector3</a>
 *
 * ( class Vector3 implements Vector<Vector3> )
 */
export class Vector3 /*implements Vector*/ {
	x: f32
	y: f32
	z: f32
	isVector3: bool = true

	constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	/**
	 * Sets value of this vector.
	 */
	set(x: f32, y: f32, z: f32): this {
		this.x = x
		this.y = y
		this.z = z

		return this
	}

	// /**
	//  * Sets all values of this vector.
	//  */
	// setScalar(scalar: f32): this {
	// 	this.x = scalar
	// 	this.y = scalar
	// 	this.z = scalar

	// 	return this
	// }

	/**
	 * Sets x value of this vector.
	 */
	setX(x: f32): this {
		this.x = x

		return this
	}

	/**
	 * Sets y value of this vector.
	 */
	setY(y: f32): this {
		this.y = y

		return this
	}

	/**
	 * Sets z value of this vector.
	 */
	setZ(z: f32): this {
		this.z = z

		return this
	}

	private __xChar: u32 = u32('x'.charCodeAt(0))
	private __yChar: u32 = u32('y'.charCodeAt(0))
	private __zChar: u32 = u32('z'.charCodeAt(0))
	private __invalidNameMsg: string = 'Invalid component name. Exected "x", "y", or "z".'

	setComponent(name: string, value: f32): this {
		if (name.length != 1) throw new Error(this.__invalidNameMsg)

		// prettier-ignore
		// Note, AS only supports u32 values (f.e. enums) in switch statements, that's why we cast.
		switch (u32(name.charCodeAt(0))) {
			case this.__xChar: return this.setX(value)
			case this.__yChar: return this.setY(value)
			case this.__zChar: return this.setZ(value)
			default: throw new Error(this.__invalidNameMsg)
		}
	}

	getComponent(name: string): f32 {
		if (name.length != 1) throw new Error(this.__invalidNameMsg)

		// prettier-ignore
		// Note, AS only supports u32 values (f.e. enums) in switch statements, that's why we cast.
		switch (u32(name.charCodeAt(0))) {
			case this.__xChar: return this.x
			case this.__yChar: return this.y
			case this.__zChar: return this.z
			default: throw new Error(this.__invalidNameMsg)
		}
	}

	// /**
	//  * Clones this vector.
	//  */
	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z)
	}

	/**
	 * Copies value of v to this vector.
	 */
	copy(v: Vector3): this {
		this.x = v.x
		this.y = v.y
		this.z = v.z

		return this
	}

	/**
	 * Adds v to this vector.
	 */
	add(a: Vector3): this {
		this.x += a.x
		this.y += a.y
		this.z += a.z

		return this
	}

	addScalar(s: f32): this {
		this.x += s
		this.y += s
		this.z += s

		return this
	}

	// addScaledVector(v: Vector3, s: f32): this {
	// 	this.x += v.x * s
	// 	this.y += v.y * s
	// 	this.z += v.z * s

	// 	return this
	// }

	/**
	 * Sets this vector to a + b.
	 */
	addVectors(a: Vector3, b: Vector3): this {
		this.x = a.x + b.x
		this.y = a.y + b.y
		this.z = a.z + b.z

		return this
	}

	// /**
	//  * Subtracts v from this vector.
	//  */
	sub(a: Vector3): this {
		// if ( w !== undefined ) {

		// 	console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
		// 	return this.subVectors( v, w );

		// }

		this.x -= a.x
		this.y -= a.y
		this.z -= a.z

		return this
	}

	// subScalar(s: f32): this {
	// 	this.x -= s
	// 	this.y -= s
	// 	this.z -= s

	// 	return this
	// }

	/**
	 * Sets this vector to a - b.
	 */
	subVectors(a: Vector3, b: Vector3): this {
		this.x = a.x - b.x
		this.y = a.y - b.y
		this.z = a.z - b.z

		return this
	}

	// multiply(v: Vector3): this {
	// 	// if ( w !== undefined ) {

	// 	// 	console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
	// 	// 	return this.multiplyVectors( v, w );

	// 	// }

	// 	this.x *= v.x
	// 	this.y *= v.y
	// 	this.z *= v.z

	// 	return this
	// }

	/**
	 * Multiplies this vector by scalar s.
	 */
	multiplyScalar(scalar: f32): this {
		this.x *= scalar
		this.y *= scalar
		this.z *= scalar

		return this
	}

	// multiplyVectors(a: Vector3, b: Vector3): this {
	// 	this.x = a.x * b.x
	// 	this.y = a.y * b.y
	// 	this.z = a.z * b.z

	// 	return this
	// }

	// applyEuler(euler: Euler): this {
	// 	var quaternion = new Quaternion()

	// 	// if ( ! ( euler && euler.isEuler ) ) {

	// 	//     console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

	// 	// }

	// 	return this.applyQuaternion(quaternion.setFromEuler(euler))
	// }

	// applyAxisAngle(axis: Vector3, angle: f32): this {
	// 	var quaternion = new Quaternion()

	// 	return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle))
	// }

	applyMatrix3(m: Matrix3): this {
		const x = this.x,
			y = this.y,
			z = this.z
		const e = m.elements

		this.x = e[0] * x + e[3] * y + e[6] * z
		this.y = e[1] * x + e[4] * y + e[7] * z
		this.z = e[2] * x + e[5] * y + e[8] * z

		return this
	}

	applyMatrix4(m: Matrix4): this {
		const x = this.x,
			y = this.y,
			z = this.z
		const e = m.elements

		const w = f32(1 / (e[3] * x + e[7] * y + e[11] * z + e[15]))

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w

		return this
	}

	// applyQuaternion(q: Quaternion): this {
	// 	var x = this.x,
	// 		y = this.y,
	// 		z = this.z
	// 	var qx = q.x,
	// 		qy = q.y,
	// 		qz = q.z,
	// 		qw = q.w

	// 	// calculate quat * vector

	// 	var ix = qw * x + qy * z - qz * y
	// 	var iy = qw * y + qz * x - qx * z
	// 	var iz = qw * z + qx * y - qy * x
	// 	var iw = -qx * x - qy * y - qz * z

	// 	// calculate result * inverse quat

	// 	this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
	// 	this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
	// 	this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx

	// 	return this
	// }

	// project(camera: Camera): this {
	// 	return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix)
	// }

	// unproject(camera: Camera): this {
	// 	return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld)
	// }

	transformDirection(m: Matrix4): this {
		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		const x = this.x,
			y = this.y,
			z = this.z
		const e = m.elements

		this.x = e[0] * x + e[4] * y + e[8] * z
		this.y = e[1] * x + e[5] * y + e[9] * z
		this.z = e[2] * x + e[6] * y + e[10] * z

		return this.normalize()
	}

	// divide(v: Vector3): this {
	// 	this.x /= v.x
	// 	this.y /= v.y
	// 	this.z /= v.z

	// 	return this
	// }

	/**
	 * Divides this vector by scalar.
	 * Set vector to ( 0, 0, 0 ) if s == 0.
	 */
	divideScalar(scalar: f32): this {
		return this.multiplyScalar(1 / scalar)
	}

	min(v: Vector3): this {
		this.x = Mathf.min(this.x, v.x)
		this.y = Mathf.min(this.y, v.y)
		this.z = Mathf.min(this.z, v.z)

		return this
	}

	max(v: Vector3): this {
		this.x = Mathf.max(this.x, v.x)
		this.y = Mathf.max(this.y, v.y)
		this.z = Mathf.max(this.z, v.z)

		return this
	}

	// clamp(min: Vector3, max: Vector3): this {
	// 	this.x = Mathf.max(min.x, Mathf.min(max.x, this.x))
	// 	this.y = Mathf.max(min.y, Mathf.min(max.y, this.y))
	// 	this.z = Mathf.max(min.z, Mathf.min(max.z, this.z))

	// 	return this
	// }

	// clampScalar(min: f32, max: f32): this {
	// 	this.x = Mathf.max(min, Mathf.min(max, this.x))
	// 	this.y = Mathf.max(min, Mathf.min(max, this.y))
	// 	this.z = Mathf.max(min, Mathf.min(max, this.z))

	// 	return this
	// }

	// clampLength(min: f32, max: f32): this {
	// 	var length = this.length

	// 	return this.divideScalar(length || 1).multiplyScalar(Mathf.max(min, Mathf.min(max, length)))
	// }

	// floor(): this {
	// 	this.x = Mathf.floor(this.x)
	// 	this.y = Mathf.floor(this.y)
	// 	this.z = Mathf.floor(this.z)

	// 	return this
	// }

	// ceil(): this {
	// 	this.x = Mathf.ceil(this.x)
	// 	this.y = Mathf.ceil(this.y)
	// 	this.z = Mathf.ceil(this.z)

	// 	return this
	// }

	// round(): this {
	// 	this.x = Mathf.round(this.x)
	// 	this.y = Mathf.round(this.y)
	// 	this.z = Mathf.round(this.z)

	// 	return this
	// }

	// roundToZero(): this {
	// 	this.x = this.x < 0 ? Mathf.ceil(this.x) : Mathf.floor(this.x)
	// 	this.y = this.y < 0 ? Mathf.ceil(this.y) : Mathf.floor(this.y)
	// 	this.z = this.z < 0 ? Mathf.ceil(this.z) : Mathf.floor(this.z)

	// 	return this
	// }

	/**
	 * Inverts this vector.
	 */
	negate(): this {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z

		return this
	}

	/**
	 * Computes dot product of this vector and v.
	 */
	dot(v: Vector3): f32 {
		return this.x * v.x + this.y * v.y + this.z * v.z
	}

	// /**
	//  * Computes squared length of this vector.
	//  */
	lengthSq(): f32 {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}

	/**
	 * Computes length of this vector.
	 */
	length(): f32 {
		return Mathf.sqrt(this.lengthSq())
	}

	// /**
	//  * Computes the Manhattan length of this vector.
	//  *
	//  * @return {f32}
	//  *
	//  * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
	//  */
	// manhattanLength(): f32 {
	// 	return Mathf.abs(this.x) + Mathf.abs(this.y) + Mathf.abs(this.z)
	// }

	/**
	 * Normalizes this vector.
	 */
	normalize(): this {
		return this.divideScalar(this.length() || 1)
	}

	// /**
	//  * Normalizes this vector and multiplies it by l.
	//  */
	// setLength(length: f32): this {
	// 	return this.normalize().multiplyScalar(length)
	// }

	// lerp(v: Vector3, alpha: f32): this {
	// 	this.x += (v.x - this.x) * alpha
	// 	this.y += (v.y - this.y) * alpha
	// 	this.z += (v.z - this.z) * alpha

	// 	return this
	// }

	// lerpVectors(v1: Vector3, v2: Vector3, alpha: f32): this {
	// 	return this.subVectors(v2, v1)
	// 		.multiplyScalar(alpha)
	// 		.add(v1)
	// }

	/**
	 * Sets this vector to cross product of itself and v.
	 */
	cross(a: Vector3): this {
		// if ( w !== undefined ) {

		// 	console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
		// 	return this.crossVectors( v, w );

		// }

		return this.crossVectors(this, a)
	}

	/**
	 * Sets this vector to cross product of a and b.
	 */
	crossVectors(a: Vector3, b: Vector3): this {
		const ax = a.x,
			ay = a.y,
			az = a.z
		const bx = b.x,
			by = b.y,
			bz = b.z

		this.x = ay * bz - az * by
		this.y = az * bx - ax * bz
		this.z = ax * by - ay * bx

		return this
	}

	// projectOnVector(vector: Vector3): this {
	// 	var scalar = vector.dot(this) / vector.lengthSq()

	// 	return this.copy(vector).multiplyScalar(scalar)
	// }

	// projectOnPlane(planeNormal: Vector3): this {
	// 	var v1 = new Vector3(0, 0, 0)

	// 	v1.copy(this).projectOnVector(planeNormal)

	// 	return this.sub(v1)
	// }

	// reflect(vector: Vector3): this {
	// 	// reflect incident vector off plane orthogonal to normal
	// 	// normal is assumed to have unit length

	// 	var v1 = new Vector3(0, 0, 0)
	// 	var normal = new Vector3(1, 1, 1)

	// 	return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)))
	// }

	// angleTo(v: Vector3): f32 {
	// 	var theta = this.dot(v) / Mathf.sqrt(this.lengthSq() * v.lengthSq())

	// 	// clamp, to handle numerical problems

	// 	return Mathf.acos(_Math.clamp(theta, -1, 1))
	// }

	/**
	 * Computes distance of this vector to v.
	 */
	distanceTo(v: Vector3): f32 {
		return Mathf.sqrt(this.distanceToSquared(v))
	}

	/**
	 * Computes squared distance of this vector to v.
	 */
	distanceToSquared(v: Vector3): f32 {
		const dx = this.x - v.x,
			dy = this.y - v.y,
			dz = this.z - v.z

		return dx * dx + dy * dy + dz * dz
	}

	// /**
	//  * Computes the Manhattan length (distance) from this vector to the given vector v
	//  *
	//  * @param {Vector3} v
	//  *
	//  * @return {f32}
	//  *
	//  * @see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
	//  */
	// manhattanDistanceTo(v: Vector3): f32 {
	// 	return Mathf.abs(this.x - v.x) + Mathf.abs(this.y - v.y) + Mathf.abs(this.z - v.z)
	// }

	// setFromSpherical(s: Spherical): this {
	// 	return this.setFromSphericalCoords(s.radius, s.phi, s.theta)
	// }

	// setFromSphericalCoords(radius: f32, phi: f32, theta: f32): this {
	// 	var sinPhiRadius = Mathf.sin(phi) * radius

	// 	this.x = sinPhiRadius * Mathf.sin(theta)
	// 	this.y = Mathf.cos(phi) * radius
	// 	this.z = sinPhiRadius * Mathf.cos(theta)

	// 	return this
	// }

	// setFromCylindrical(c: Cylindrical): this {
	// 	return this.setFromCylindricalCoords(c.radius, c.theta, c.y)
	// }

	// setFromCylindricalCoords(radius: f32, theta: f32, y: f32): this {
	// 	this.x = radius * Mathf.sin(theta)
	// 	this.y = y
	// 	this.z = radius * Mathf.cos(theta)

	// 	return this
	// }

	setFromMatrixPosition(m: Matrix4): this {
		const e = m.elements

		this.x = e[12]
		this.y = e[13]
		this.z = e[14]

		return this
	}

	// setFromMatrixScale(m: Matrix4): this {
	// 	var sx = this.setFromMatrixColumn(m, 0).length
	// 	var sy = this.setFromMatrixColumn(m, 1).length
	// 	var sz = this.setFromMatrixColumn(m, 2).length

	// 	this.x = sx
	// 	this.y = sy
	// 	this.z = sz

	// 	return this
	// }

	setFromMatrixColumn(matrix: Matrix4, index: i32): Vector3 {
		return this.fromArray(matrix.elements, index * 4)
	}

	/**
	 * Checks for strict equality of this vector and v.
	 */
	equals(v: Vector3): boolean {
		return v.x === this.x && v.y === this.y && v.z === this.z
	}

	fromArray(array: f32[], offset: i32 = 0): Vector3 {
		this.x = array[offset]
		this.y = array[offset + 1]
		this.z = array[offset + 2]

		return this
	}

	/**
	 * Returns an array [x, y, z], or copies x, y and z into the provided array.
	 * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
	 * @param offset (optional) optional offset into the array.
	 * @return The created or provided array.
	 */
	toArray(array: f32[] = [], offset: i32 = 0): f32[] {
		array[offset] = this.x
		array[offset + 1] = this.y
		array[offset + 2] = this.z

		return array
	}

	// /**
	//  * Copies x, y and z into the provided array-like.
	//  * @param array array-like to store the vector to.
	//  * @param offset (optional) optional offset into the array.
	//  * @return The provided array-like.
	//  */
	// // toArray( xyz: ArrayLike<f32>, offset?: f32 ): ArrayLike<f32>;

	// fromBufferAttribute(attribute: BufferAttribute, index: f32, offset?: f32): this {
	// 	this.x = attribute.getX(index)
	// 	this.y = attribute.getY(index)
	// 	this.z = attribute.getZ(index)

	// 	return this
	// }
}
