/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author corruptedzulu / http://github.com/corruptedzulu
 * @author Joe Pea / http://github.com/trusktr
 * @author Kara Rawson / https://github.com/zoedreams
 */

import { Vector3 } from '../math/Vector3'
import { Box3 } from '../math/Box3'
import { EventDispatcher } from './EventDispatcher'
import {
	BufferAttribute,
	Float32BufferAttribute,
	Uint16BufferAttribute,
	Uint32BufferAttribute,
	ArrayType,
} from './BufferAttribute'
// import { InterleavedBufferAttribute } from './InterleavedBufferAttribute.js';
import { Sphere } from '../math/Sphere'
//import {DirectGeometry} from './DirectGeometry.js'
import { Object3D } from './Object3D'
import { Matrix4 } from '../math/Matrix4'
import { Matrix3 } from '../math/Matrix3'
import * as MathUtils from '../math/MathUtils'
import { arrayMax } from '../utils'
import { Event } from './Event'
import { Geometry } from './Geometry'
import { fillUint32ArrayWithValues, fillUint16ArrayWithValues } from './TypedArrayUtils'
//TODO: uncomment when Points, Mesh, Line implemented
// import {Points} from '../objects/Points'
// import {Mesh} from '../objects/Mesh'
// import {Line} from '../objects/Line'

/**
 * simple struct to store our box geometry info in an array.
 */
export class BufferGeometryGroup {
	start: i32
	count: i32
	materialIndex: i32
}

/**
 * how much of the geometry faces we are going to draw from the buffer.
 */
class BufferGeometryDrawRange {
	start: i32
	count: f32

	constructor(s: i32, c: f32) {
		this.start = s
		this.count = c
	}
}

let bufferGeometryId = 1 // BufferGeometry uses odd numbers as Id

/**
 * our general purpose box geometry which represents simple geometric structures. These
 * as store in buffer like arrays which is used by the rendering engine to project the
 * geometry onto our scene.
 *
 * @source https://github.com/mrdoob/three.js/blob/master/src/core/BufferGeometry.js
 */
export class BufferGeometry extends EventDispatcher {
	/**
	 * Unique number of this buffergeometry instance
	 */
	readonly id: i32 = (bufferGeometryId += 2)

	uuid: string = MathUtils.generateUUID()

	name: string = ''
	type: string = 'BufferGeometry'

	index: BufferAttribute | null = null
	attributes: Map<string, BufferAttribute> /* | InterleavedBufferAttribute> */ = new Map()

	morphAttributes: Map<string, BufferAttribute[]> = new Map()
	//^ per BufferGeometryLoader.js in the original three.js, geometry.morphAttributes[key] is loaded with array of BufferAttributes

	groups: BufferGeometryGroup[] = []

	boundingBox: Box3 = new Box3()
	boundingSphere: Sphere = new Sphere()

	drawRange: BufferGeometryDrawRange = new BufferGeometryDrawRange(0, Infinity)

	// no `any` in AS
	// userData: Map<string, any>

	//This probably should be removed and a typeof or equivalent should be used instead
	isBufferGeometry: true = true

	getIndex(): BufferAttribute | null {
		return this.index
	}

	setIndex<B extends BufferAttribute>(array: B): void {
		if (!(array instanceof BufferAttribute)) throw new Error('expected a BufferAttribute')
		this.setIndexFromBufferAttribute(array)
	}

	// setIndexFromArray<A extends Array<number>>(index: A): void {
	// 	if (arrayMax(index) > 65535) {
	// 		this.index = new Uint32BufferAttribute(index.length, 1)
	// 		fillUint32ArrayWithValues(index, this.index.arrays.Uint32)
	// 	} else {
	// 		this.index = new Uint16BufferAttribute(index.length, 1)
	// 		fillUint16ArrayWithValues(index, this.index.arrays.Uint16)
	// 	}
	// 	// CONTINUE
	// }

	setIndexFromBufferAttribute(index: BufferAttribute): void {
		if (!(index.arrayType === ArrayType.Uint16 || index.arrayType === ArrayType.Uint32))
			throw new TypeError('index must be a BufferAttribute with type Uint16 or Uint32')

		// Three.js uses an item size 1
		if (index.itemSize != 1) throw new Error('index itemSize should be 1')

		if (
			(index.arrayType === ArrayType.Uint16 && index.arrays.Uint16.length == 0) ||
			(index.arrayType === ArrayType.Uint32 && index.arrays.Uint32.length == 0)
		) {
			throw new TypeError('index must have at least one item')
		}

		this.index = index
	}

	addAttribute(name: string, attribute: BufferAttribute /*| InterleavedBufferAttribute*/): BufferGeometry {
		//type system requires us to be sent BufferAttribute
		// if (!(attribute && attribute.isBufferAttribute) && !(attribute && attribute.isInterleavedBufferAttribute)) {
		// 	console.warn('THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).')

		// 	return this.addAttribute(name, new BufferAttribute(arguments[1], arguments[2]))
		// }

		// if (name === 'index') {
		// 	//console.warn('THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.')

		// 	this.setIndex(attribute)

		// 	return this
		// }

		this.attributes.set(name, attribute)

		return this
	}

	//TODO: uncomment when needed
	// getAttribute(name: string): BufferAttribute | InterleavedBufferAttribute {
	// 	return this.attributes[name]
	// }

	removeAttribute(name: string): this {
		this.attributes.delete(name)
		return this
	}

	/**
	 * a simple helper function used to push / add new geometry groups into our array that contains
	 * the objects that we are going to render
	 * @param start is the beginning position we wish to offset for, use case?
	 * @param count how big of an array we are going to create in memory
	 * @param materialIndex the integer referenc
	 */
	addGroup(start: i32, count: i32, materialIndex: i32 = 0): void {
		this.groups.push({
			start,
			count,
			materialIndex,
		} as BufferGeometryGroup)
	}

	/**
	 * clears buffer geometery group arrays by allocating a new empty array in place. This is required
	 * to properly invoke the GC within the heap stack.
	 */
	clearGroups(): void {
		this.groups.length = 0
	}

	// setDrawRange(start: f32, count: f32): void {
	// 	this.drawRange.start = start
	// 	this.drawRange.count = count
	// }

	// /**
	//  * Bakes matrix transform directly into vertex coordinates.
	//  */
	// applyMatrix(matrix: Matrix4): BufferGeometry {
	// 	var position = this.attributes.position

	// 	if (position !== undefined) {
	// 		matrix.applyToBufferAttribute(position)
	// 		position.needsUpdate = true
	// 	}

	// 	var normal = this.attributes.normal

	// 	if (normal !== undefined) {
	// 		var normalMatrix = new Matrix3().getNormalMatrix(matrix)

	// 		normalMatrix.applyToBufferAttribute(normal)
	// 		normal.needsUpdate = true
	// 	}

	// 	var tangent = this.attributes.tangent

	// 	if (tangent !== undefined) {
	// 		var normalMatrix = new Matrix3().getNormalMatrix(matrix)

	// 		// Tangent is vec4, but the '.w' component is a sign value (+1/-1).
	// 		normalMatrix.applyToBufferAttribute(tangent)
	// 		tangent.needsUpdate = true
	// 	}

	// 	if (this.boundingBox !== null) {
	// 		this.computeBoundingBox()
	// 	}

	// 	if (this.boundingSphere !== null) {
	// 		this.computeBoundingSphere()
	// 	}

	// 	return this
	// }

	// rotateX(angle: f32): BufferGeometry {
	// 	// rotate geometry around world x-axis

	// 	var m1 = new Matrix4()

	// 	m1.makeRotationX(angle)

	// 	this.applyMatrix(m1)

	// 	return this
	// }

	// rotateY(angle: f32): BufferGeometry {
	// 	// rotate geometry around world y-axis

	// 	var m1 = new Matrix4()

	// 	m1.makeRotationY(angle)

	// 	this.applyMatrix(m1)

	// 	return this
	// }

	// rotateZ(angle: f32): BufferGeometry {
	// 	var m1 = new Matrix4()

	// 	m1.makeRotationZ(angle)

	// 	this.applyMatrix(m1)

	// 	return this
	// }

	// translate(x: f32, y: f32, z: f32): BufferGeometry {
	// 	// translate geometry

	// 	var m1 = new Matrix4()

	// 	m1.makeTranslation(x, y, z)

	// 	this.applyMatrix(m1)

	// 	return this
	// }

	//TODO: uncomment when needed
	// scale(x: f32, y: f32, z: f32): BufferGeometry {
	// 	// scale geometry

	// 	var m1 = new Matrix4()

	// 	m1.makeScale(x, y, z)

	// 	this.applyMatrix(m1)

	// 	return this
	// }

	// lookAt(v: Vector3): void {
	// 	var obj = new Object3D()

	// 	obj.lookAt(vector)

	// 	obj.updateMatrix()

	// 	this.applyMatrix(obj.matrix)
	// }

	// center(): BufferGeometry {
	// 	var offset = new Vector3()

	// 	this.computeBoundingBox()

	// 	this.boundingBox.getCenter(offset).negate()

	// 	this.translate(offset.x, offset.y, offset.z)

	// 	return this
	// }

	//TODO: uncomment when Points, Mesh, Line implemented
	// setFromObject(object: Object3D): BufferGeometry {
	// 	// console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

	// 	var geometry = object.geometry

	// 	// if (object.isPoints || object.isLine) {
	// 	if (object instanceof Points || object instanceof Line) {
	// 		var positions = new Float32BufferAttribute(new Float32Array(geometry.vertices.length * 3), 3)
	// 		var colors = new Float32BufferAttribute(new Float32Array(geometry.colors.length * 3), 3)

	// 		this.addAttribute('position', positions.copyVector3sArray(geometry.vertices))
	// 		this.addAttribute('color', colors.copyColorsArray(geometry.colors))

	// 		if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {
	// 			var lineDistances = new Float32BufferAttribute(new Float32Array(geometry.lineDistances.length), 1)

	// 			let floatArray = new Float32Array(geometry.lineDistances.length)

	// 			for (var i = 0; i < geometry.lineDistances.length; i++) {
	// 				floatArray[i] = geometry.lineDistances[i]
	// 			}

	// 			this.addAttribute('lineDistance', lineDistances.copyArray(floatArray))
	// 		}

	// 		if (geometry.boundingSphere !== null) {
	// 			this.boundingSphere = geometry.boundingSphere.clone()
	// 		}

	// 		if (geometry.boundingBox !== null) {
	// 			this.boundingBox = geometry.boundingBox.clone()
	// 		}
	// 	} else if (object instanceof Mesh) {
	// 		// } else if (object.isMesh) {
	// 		//instanceof geometry should always be true in AS....?
	// 		if (geometry && geometry instanceof Geometry) {
	// 			//TODO: uncomment when DirectGeometry is implemented
	// 			//this.fromGeometry(geometry)
	// 		}
	// 	}

	// 	return this
	// }

	//TODO: uncomment when needed
	// setFromPoints(points: Vector3[] | Vector2[]): BufferGeometry {
	// 	var position = []

	// 	for (var i = 0, l = points.length; i < l; i++) {
	// 		var point = points[i]
	// 		position.push(point.x, point.y, point.z || 0)
	// 	}

	// 	this.addAttribute('position', new Float32BufferAttribute(position, 3))

	// 	return this
	// }

	//TODO: Geometry/BufferGeometry needs to be sorted out on Object3D
	// updateFromObject(object: Object3D): BufferGeometry {
	// 	var geometry = object.geometry

	// 	if (object.isMesh) {
	// 		var direct = geometry.__directGeometry

	// 		if (geometry.elementsNeedUpdate === true) {
	// 			direct = undefined
	// 			geometry.elementsNeedUpdate = false
	// 		}

	// 		if (direct === undefined) {
	// 			return this.fromGeometry(geometry)
	// 		}

	// 		direct.verticesNeedUpdate = geometry.verticesNeedUpdate
	// 		direct.normalsNeedUpdate = geometry.normalsNeedUpdate
	// 		direct.colorsNeedUpdate = geometry.colorsNeedUpdate
	// 		direct.uvsNeedUpdate = geometry.uvsNeedUpdate
	// 		direct.groupsNeedUpdate = geometry.groupsNeedUpdate

	// 		geometry.verticesNeedUpdate = false
	// 		geometry.normalsNeedUpdate = false
	// 		geometry.colorsNeedUpdate = false
	// 		geometry.uvsNeedUpdate = false
	// 		geometry.groupsNeedUpdate = false

	// 		geometry = direct
	// 	}

	// 	var attribute: BufferAttribute

	// 	if (geometry.verticesNeedUpdate === true) {
	// 		if (this.attributes.has('position')) {
	// 			attribute = this.attributes.get('position')
	// 			attribute.copyVector3sArray(geometry.vertices)
	// 			attribute.needsUpdate = true
	// 		}

	// 		geometry.verticesNeedUpdate = false
	// 	}

	// 	if (geometry.normalsNeedUpdate === true) {
	// 		if (this.attributes.has('normal')) {
	// 			attribute = this.attributes.get('normal')
	// 			attribute.copyVector3sArray(geometry.normals)
	// 			attribute.needsUpdate = true
	// 		}

	// 		geometry.normalsNeedUpdate = false
	// 	}

	// 	if (geometry.colorsNeedUpdate === true) {
	// 		if (this.attributes.has('color')) {
	// 			attribute = this.attributes.get('color')
	// 			attribute.copyVector3sArray(geometry.colors)
	// 			attribute.needsUpdate = true
	// 		}

	// 		geometry.colorsNeedUpdate = false
	// 	}

	// 	if (geometry.uvsNeedUpdate) {
	// 		if (this.attributes.has('uv')) {
	// 			attribute = this.attributes.get('uv')
	// 			attribute.copyVector3sArray(geometry.uvs)
	// 			attribute.needsUpdate = true
	// 		}

	// 		geometry.uvsNeedUpdate = false
	// 	}

	// 	if (geometry.lineDistancesNeedUpdate) {
	// 		if (this.attributes.has('lineDistance')) {
	// 			attribute = this.attributes.get('lineDistance')
	// 			attribute.copyVector3sArray(geometry.lineDistances)
	// 			attribute.needsUpdate = true
	// 		}

	// 		geometry.lineDistancesNeedUpdate = false
	// 	}

	// 	if (geometry.groupsNeedUpdate) {
	// 		geometry.computeGroups(object.geometry)
	// 		this.groups = geometry.groups

	// 		geometry.groupsNeedUpdate = false
	// 	}

	// 	return this
	// }

	//TODO: uncomment when DirectGeometry is implemented
	// fromGeometry(geometry: Geometry, settings?: any): BufferGeometry {
	// 	geometry.__directGeometry = new DirectGeometry().fromGeometry(geometry)

	// 	return this.fromDirectGeometry(geometry.__directGeometry)
	// }

	//TODO: uncomment when DirectGeometry is implemented
	// fromDirectGeometry(geometry: DirectGeometry): BufferGeometry {
	// 	var positions = new Float32Array(geometry.vertices.length * 3)
	// 	this.addAttribute('position', new BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices))

	// 	if (geometry.normals.length > 0) {
	// 		var normals = new Float32Array(geometry.normals.length * 3)
	// 		this.addAttribute('normal', new BufferAttribute(normals, 3).copyVector3sArray(geometry.normals))
	// 	}

	// 	if (geometry.colors.length > 0) {
	// 		var colors = new Float32Array(geometry.colors.length * 3)
	// 		this.addAttribute('color', new BufferAttribute(colors, 3).copyColorsArray(geometry.colors))
	// 	}

	// 	if (geometry.uvs.length > 0) {
	// 		var uvs = new Float32Array(geometry.uvs.length * 2)
	// 		this.addAttribute('uv', new BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs))
	// 	}

	// 	if (geometry.uvs2.length > 0) {
	// 		var uvs2 = new Float32Array(geometry.uvs2.length * 2)
	// 		this.addAttribute('uv2', new BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2))
	// 	}

	// 	// groups

	// 	this.groups = geometry.groups

	// 	// morphs

	// 	for (var name in geometry.morphTargets) {
	// 		var array = []
	// 		var morphTargets = geometry.morphTargets[name]

	// 		for (var i = 0, l = morphTargets.length; i < l; i++) {
	// 			var morphTarget = morphTargets[i]

	// 			var attribute = new Float32BufferAttribute(morphTarget.data.length * 3, 3)
	// 			attribute.name = morphTarget.name

	// 			array.push(attribute.copyVector3sArray(morphTarget.data))
	// 		}

	// 		this.morphAttributes[name] = array
	// 	}

	// 	// skinning

	// 	if (geometry.skinIndices.length > 0) {
	// 		var skinIndices = new Float32BufferAttribute(geometry.skinIndices.length * 4, 4)
	// 		this.addAttribute('skinIndex', skinIndices.copyVector4sArray(geometry.skinIndices))
	// 	}

	// 	if (geometry.skinWeights.length > 0) {
	// 		var skinWeights = new Float32BufferAttribute(geometry.skinWeights.length * 4, 4)
	// 		this.addAttribute('skinWeight', skinWeights.copyVector4sArray(geometry.skinWeights))
	// 	}

	// 	//

	// 	if (geometry.boundingSphere !== null) {
	// 		this.boundingSphere = geometry.boundingSphere.clone()
	// 	}

	// 	if (geometry.boundingBox !== null) {
	// 		this.boundingBox = geometry.boundingBox.clone()
	// 	}

	// 	return this
	// }

	//TODO: uncomment when needed
	/**
	 * Computes bounding box of the geometry, updating Geometry.boundingBox attribute.
	 * Bounding boxes aren't computed by default. They need to be explicitly computed, otherwise they are null.
	 */
	// computeBoundingBox(): void {
	// 	var box = new Box3()

	// 	if (this.boundingBox === null) {
	// 		this.boundingBox = new Box3()
	// 	}

	// 	var position = this.attributes.position
	// 	var morphAttributesPosition = this.morphAttributes.position

	// 	if (position !== undefined) {
	// 		this.boundingBox.setFromBufferAttribute(position)

	// 		// process morph attributes if present

	// 		if (morphAttributesPosition) {
	// 			for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	// 				var morphAttribute = morphAttributesPosition[i]
	// 				box.setFromBufferAttribute(morphAttribute)

	// 				this.boundingBox.expandByPoint(box.min)
	// 				this.boundingBox.expandByPoint(box.max)
	// 			}
	// 		}
	// 	} else {
	// 		this.boundingBox.makeEmpty()
	// 	}

	// 	if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
	// 		console.error(
	// 			'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
	// 			this
	// 		)
	// 	}
	// }

	//TODO: uncomment when needed
	// /**
	//  * Computes bounding sphere of the geometry, updating Geometry.boundingSphere attribute.
	//  * Bounding spheres aren't' computed by default. They need to be explicitly computed, otherwise they are null.
	//  */
	// computeBoundingSphere(): void {
	// 	var box = new Box3()
	// 	var boxMorphTargets = new Box3()
	// 	var vector = new Vector3()

	// 	if (this.boundingSphere === null) {
	// 		this.boundingSphere = new Sphere()
	// 	}

	// 	var position = this.attributes.position
	// 	var morphAttributesPosition = this.morphAttributes.position

	// 	if (position) {
	// 		// first, find the center of the bounding sphere

	// 		var center = this.boundingSphere.center

	// 		box.setFromBufferAttribute(position)

	// 		// process morph attributes if present

	// 		if (morphAttributesPosition) {
	// 			for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	// 				var morphAttribute = morphAttributesPosition[i]
	// 				boxMorphTargets.setFromBufferAttribute(morphAttribute)

	// 				box.expandByPoint(boxMorphTargets.min)
	// 				box.expandByPoint(boxMorphTargets.max)
	// 			}
	// 		}

	// 		box.getCenter(center)

	// 		// second, try to find a boundingSphere with a radius smaller than the
	// 		// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

	// 		var maxRadiusSq = 0

	// 		for (var i = 0, il = position.count; i < il; i++) {
	// 			vector.fromBufferAttribute(position, i)

	// 			maxRadiusSq = Mathf.max(maxRadiusSq, center.distanceToSquared(vector))
	// 		}

	// 		// process morph attributes if present

	// 		if (morphAttributesPosition) {
	// 			for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	// 				var morphAttribute = morphAttributesPosition[i]

	// 				for (var j = 0, jl = morphAttribute.count; j < jl; j++) {
	// 					vector.fromBufferAttribute(morphAttribute, j)

	// 					maxRadiusSq = Mathf.max(maxRadiusSq, center.distanceToSquared(vector))
	// 				}
	// 			}
	// 		}

	// 		this.boundingSphere.radius = Mathf.sqrt(maxRadiusSq)

	// 		if (isNaN(this.boundingSphere.radius)) {
	// 			console.error(
	// 				'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
	// 				this
	// 			)
	// 		}
	// 	}
	// }

	// /**
	//  * Computes vertex normals by averaging face normals.
	//  */
	// computeVertexNormals(): void {
	// 	var index = this.index
	// 	var attributes = this.attributes

	// 	if (attributes.position) {
	// 		var positions = attributes.position.array

	// 		if (attributes.normal === undefined) {
	// 			this.addAttribute('normal', new BufferAttribute(new Float32Array(positions.length), 3))
	// 		} else {
	// 			// reset existing normals to zero

	// 			var array = attributes.normal.array

	// 			for (var i = 0, il = array.length; i < il; i++) {
	// 				array[i] = 0
	// 			}
	// 		}

	// 		var normals = attributes.normal.array

	// 		var vA, vB, vC
	// 		var pA = new Vector3(),
	// 			pB = new Vector3(),
	// 			pC = new Vector3()
	// 		var cb = new Vector3(),
	// 			ab = new Vector3()

	// 		// indexed elements

	// 		if (index) {
	// 			var indices = index.array

	// 			for (var i = 0, il = index.count; i < il; i += 3) {
	// 				vA = indices[i + 0] * 3
	// 				vB = indices[i + 1] * 3
	// 				vC = indices[i + 2] * 3

	// 				pA.fromArray(positions, vA)
	// 				pB.fromArray(positions, vB)
	// 				pC.fromArray(positions, vC)

	// 				cb.subVectors(pC, pB)
	// 				ab.subVectors(pA, pB)
	// 				cb.cross(ab)

	// 				normals[vA] += cb.x
	// 				normals[vA + 1] += cb.y
	// 				normals[vA + 2] += cb.z

	// 				normals[vB] += cb.x
	// 				normals[vB + 1] += cb.y
	// 				normals[vB + 2] += cb.z

	// 				normals[vC] += cb.x
	// 				normals[vC + 1] += cb.y
	// 				normals[vC + 2] += cb.z
	// 			}
	// 		} else {
	// 			// non-indexed elements (unconnected triangle soup)

	// 			for (var i = 0, il = positions.length; i < il; i += 9) {
	// 				pA.fromArray(positions, i)
	// 				pB.fromArray(positions, i + 3)
	// 				pC.fromArray(positions, i + 6)

	// 				cb.subVectors(pC, pB)
	// 				ab.subVectors(pA, pB)
	// 				cb.cross(ab)

	// 				normals[i] = cb.x
	// 				normals[i + 1] = cb.y
	// 				normals[i + 2] = cb.z

	// 				normals[i + 3] = cb.x
	// 				normals[i + 4] = cb.y
	// 				normals[i + 5] = cb.z

	// 				normals[i + 6] = cb.x
	// 				normals[i + 7] = cb.y
	// 				normals[i + 8] = cb.z
	// 			}
	// 		}

	// 		this.normalizeNormals()

	// 		attributes.normal.needsUpdate = true
	// 	}
	// }

	// merge(geometry: BufferGeometry, offset: f32): BufferGeometry {
	// 	if (!(geometry && geometry.isBufferGeometry)) {
	// 		console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry)
	// 		return
	// 	}

	// 	if (offset === undefined) {
	// 		offset = 0

	// 		console.warn(
	// 			'THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. ' +
	// 				'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.'
	// 		)
	// 	}

	// 	var attributes = this.attributes

	// 	for (var key in attributes) {
	// 		if (geometry.attributes[key] === undefined) continue

	// 		var attribute1 = attributes[key]
	// 		var attributeArray1 = attribute1.array

	// 		var attribute2 = geometry.attributes[key]
	// 		var attributeArray2 = attribute2.array

	// 		var attributeOffset = attribute2.itemSize * offset
	// 		var length = Mathf.min(attributeArray2.length, attributeArray1.length - attributeOffset)

	// 		for (var i = 0, j = attributeOffset; i < length; i++, j++) {
	// 			attributeArray1[j] = attributeArray2[i]
	// 		}
	// 	}

	// 	return this
	// }

	// normalizeNormals(): void {
	// 	var vector = new Vector3()
	// 	var normals = this.attributes.normal

	// 	for (var i = 0, il = normals.count; i < il; i++) {
	// 		vector.x = normals.getX(i)
	// 		vector.y = normals.getY(i)
	// 		vector.z = normals.getZ(i)

	// 		vector.normalize()

	// 		normals.setXYZ(i, vector.x, vector.y, vector.z)
	// 	}
	// }

	// toNonIndexed(): BufferGeometry {
	// 	function convertBufferAttribute(attribute, indices) {
	// 		var array = attribute.array
	// 		var itemSize = attribute.itemSize

	// 		var array2 = new array.constructor(indices.length * itemSize)

	// 		var index = 0,
	// 			index2 = 0

	// 		for (var i = 0, l = indices.length; i < l; i++) {
	// 			index = indices[i] * itemSize

	// 			for (var j = 0; j < itemSize; j++) {
	// 				array2[index2++] = array[index++]
	// 			}
	// 		}

	// 		return new BufferAttribute(array2, itemSize)
	// 	}

	// 	//

	// 	if (this.index === null) {
	// 		console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.')
	// 		return this
	// 	}

	// 	var geometry2 = new BufferGeometry()

	// 	var indices = this.index.array
	// 	var attributes = this.attributes

	// 	// attributes

	// 	for (var name in attributes) {
	// 		var attribute = attributes[name]

	// 		var newAttribute = convertBufferAttribute(attribute, indices)

	// 		geometry2.addAttribute(name, newAttribute)
	// 	}

	// 	// morph attributes

	// 	var morphAttributes = this.morphAttributes

	// 	for (name in morphAttributes) {
	// 		var morphArray = []
	// 		var morphAttribute = morphAttributes[name] // morphAttribute: array of Float32BufferAttributes

	// 		for (var i = 0, il = morphAttribute.length; i < il; i++) {
	// 			var attribute = morphAttribute[i]

	// 			var newAttribute = convertBufferAttribute(attribute, indices)

	// 			morphArray.push(newAttribute)
	// 		}

	// 		geometry2.morphAttributes[name] = morphArray
	// 	}

	// 	// groups

	// 	var groups: BufferGeometryGroup[] = this.groups

	// 	for (var i = 0, l = groups.length; i < l; i++) {
	// 		var group = groups[i]
	// 		geometry2.addGroup(group.start, group.count, group.materialIndex)
	// 	}

	// 	return geometry2
	// }

	//TODO: uncomment when needed

	// toJSON(): any {
	// 	var data = {
	// 		metadata: {
	// 			version: 4.5,
	// 			type: 'BufferGeometry',
	// 			generator: 'BufferGeometry.toJSON',
	// 		},
	// 	}

	// 	// standard BufferGeometry serialization

	// 	data.uuid = this.uuid
	// 	data.type = this.type
	// 	if (this.name !== '') data.name = this.name
	// 	if (Object.keys(this.userData).length > 0) data.userData = this.userData

	// 	if (this.parameters !== undefined) {
	// 		var parameters = this.parameters

	// 		for (var key in parameters) {
	// 			if (parameters[key] !== undefined) data[key] = parameters[key]
	// 		}

	// 		return data
	// 	}

	// 	data.data = {
	// 		attributes: {},
	// 	}

	// 	var index = this.index

	// 	if (index !== null) {
	// 		data.data.index = {
	// 			type: index.array.constructor.name,
	// 			array: Array.prototype.slice.call(index.array),
	// 		}
	// 	}

	// 	var attributes = this.attributes

	// 	for (var key in attributes) {
	// 		var attribute = attributes[key]

	// 		var attributeData = attribute.toJSON()

	// 		if (attribute.name !== '') attributeData.name = attribute.name

	// 		data.data.attributes[key] = attributeData
	// 	}

	// 	var morphAttributes = {}
	// 	var hasMorphAttributes = false

	// 	for (var key in this.morphAttributes.keys) {
	// 		var attributeArray = this.morphAttributes[key]

	// 		var array = []

	// 		for (var i = 0, il = attributeArray.length; i < il; i++) {
	// 			var attribute = attributeArray[i]

	// 			var attributeData = attribute.toJSON()

	// 			if (attribute.name !== '') attributeData.name = attribute.name

	// 			array.push(attributeData)
	// 		}

	// 		if (array.length > 0) {
	// 			morphAttributes[key] = array

	// 			hasMorphAttributes = true
	// 		}
	// 	}

	// 	if (hasMorphAttributes) data.data.morphAttributes = morphAttributes

	// 	var groups: BufferGeometryGroup[] = this.groups

	// 	if (groups.length > 0) {
	// 		data.data.groups = JSON.parse(JSON.stringify(groups))
	// 	}

	// 	var boundingSphere = this.boundingSphere

	// 	if (boundingSphere !== null) {
	// 		data.data.boundingSphere = {
	// 			center: boundingSphere.center.toArray(),
	// 			radius: boundingSphere.radius,
	// 		}
	// 	}

	// 	return data
	// }

	// clone(): this {
	// 	/*
	// 	 // Handle primitives

	// 	 var parameters = this.parameters;

	// 	 if ( parameters !== undefined ) {

	// 	 var values = [];

	// 	 for ( var key in parameters ) {

	// 	 values.push( parameters[ key ] );

	// 	 }

	// 	 var geometry = Object.create( this.constructor.prototype );
	// 	 this.constructor.apply( geometry, values );
	// 	 return geometry;

	// 	 }

	// 	 return new this.constructor().copy( this );
	// 	 */

	// 	return new BufferGeometry().copy(this)
	// }

	// copy(source: BufferGeometry): this {
	// 	var name, i, l

	// 	// reset

	// 	this.index = null
	// 	this.attributes = {}
	// 	this.morphAttributes = {}
	// 	this.groups = []
	// 	this.boundingBox = null
	// 	this.boundingSphere = null

	// 	// name

	// 	this.name = source.name

	// 	// index

	// 	var index = source.index

	// 	if (index !== null) {
	// 		this.setIndex(index.clone())
	// 	}

	// 	// attributes

	// 	var attributes = source.attributes

	// 	for (name in attributes) {
	// 		var attribute = attributes[name]
	// 		this.addAttribute(name, attribute.clone())
	// 	}

	// 	// morph attributes

	// 	var morphAttributes = source.morphAttributes

	// 	for (name in morphAttributes) {
	// 		var array = []
	// 		var morphAttribute = morphAttributes[name] // morphAttribute: array of Float32BufferAttributes

	// 		for (i = 0, l = morphAttribute.length; i < l; i++) {
	// 			array.push(morphAttribute[i].clone())
	// 		}

	// 		this.morphAttributes[name] = array
	// 	}

	// 	// groups

	// 	var groups = source.groups

	// 	for (i = 0, l = groups.length; i < l; i++) {
	// 		var group = groups[i]
	// 		this.addGroup(group.start, group.count, group.materialIndex)
	// 	}

	// 	// bounding box

	// 	var boundingBox = source.boundingBox

	// 	if (boundingBox !== null) {
	// 		this.boundingBox = boundingBox.clone()
	// 	}

	// 	// bounding sphere

	// 	var boundingSphere = source.boundingSphere

	// 	if (boundingSphere !== null) {
	// 		this.boundingSphere = boundingSphere.clone()
	// 	}

	// 	// draw range

	// 	this.drawRange.start = source.drawRange.start
	// 	this.drawRange.count = source.drawRange.count

	// 	// user data

	// 	this.userData = source.userData

	// 	return this
	// }

	/**
	 * Disposes the object from memory.
	 * You need to call this when you want the bufferGeometry removed while the application is running.
	 */
	dispose(): void {
		this.dispatchEvent(new Event('dispose'))
	}

	// /**
	//  * @deprecated Use {@link BufferGeometry#groups .groups} instead.
	//  */
	// drawcalls: any

	// /**
	//  * @deprecated Use {@link BufferGeometry#groups .groups} instead.
	//  */
	// offsets: any

	// /**
	//  * @deprecated Use {@link BufferGeometry#setIndex .setIndex()} instead.
	//  */
	// addIndex(index: any): void

	// /**
	//  * @deprecated Use {@link BufferGeometry#addGroup .addGroup()} instead.
	//  */
	// addDrawCall(start: any, count: any, indexOffset?: any): void

	// /**
	//  * @deprecated Use {@link BufferGeometry#clearGroups .clearGroups()} instead.
	//  */
	// clearDrawCalls(): void

	//TODO: uncomment if needed?
	// addAttribute(name: any, array: any, itemSize: any): any
}
