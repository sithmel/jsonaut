//@ts-check
import { stringifyAndEncode } from "./utils.js"
import { CachedString } from "./value.js"

/**
 * @typedef {CachedString|number} JSONSegmentPathEncodedType
 */

/**
 * @typedef {string | number} JSONSegmentPathType
 */

/**
 * @typedef {Array<JSONSegmentPathType>} JSONPathType
 */

export class Path {
  /**
   * @param {Array<JSONSegmentPathEncodedType>} [array]
   * @param {number} [offset]
   */
  constructor(array = [], offset = 0) {
    this.array = array
    this.offset = offset
  }

  /** @return {number}*/
  get length() {
    return this.array.length - this.offset
  }

  /**
   * Return a new Path with the last segment added
   * @param {JSONSegmentPathEncodedType} segment
   * @return {Path}
   */
  withSegmentAdded(segment) {
    return new Path([...this.array, segment])
  }

  /**
   * Return a new Path with the last segment removed
   * @return {Path}
   */
  withSegmentRemoved() {
    return new Path(this.array.slice(0, -1))
  }

  /**
   * @param {number} index
   * @return {?JSONSegmentPathEncodedType}
   */
  get(index) {
    return this.array[index + this.offset]
  }

  /**
   * @param {(arg0: JSONSegmentPathEncodedType) => any} func
   * @return {Array<any>}
   */
  map(func) {
    const length = this.length
    const output = new Array(length) // Preallocate array size
    for (let i = 0; i < length; i++) {
      const segment = this.get(i)
      if (segment == null) {
        throw new Error("Can't be null or undefined")
      }
      output[i] = func(segment)
    }
    return output
  }

  /**
   * @return {Path}
   * */
  rest() {
    return new Path(this.array, this.offset + 1)
  }

  /** @return {JSONPathType} */
  get decoded() {
    return this.map((segment) => {
      return segment instanceof CachedString ? segment.decoded : segment
    })
  }

  /** @return {Array<Uint8Array|number>} */
  get encoded() {
    return this.map((segment) => {
      return segment instanceof CachedString ? segment.encoded : segment
    })
  }

  /**
   * Yields item arrays from end back to index, yield true on last
   * @param {number} index
   * @returns {Iterable<[number, JSONSegmentPathEncodedType]>}
   */
  *fromEndToIndex(index) {
    for (let i = this.length - 1; i >= index; i--) {
      const segment = this.get(i)
      if (segment == null) {
        throw new Error("Path segment cannot be null")
      }
      yield [i, segment]
    }
  }

  /**
   * Yields item arrays from index to end, yield true on first
   * @param {number} index
   * @returns {Iterable<[number, JSONSegmentPathEncodedType]>}
   */
  *fromIndexToEnd(index) {
    for (let i = index; i < this.length; i++) {
      const segment = this.get(i)
      if (segment == null) {
        throw new Error("Path segment cannot be null")
      }
      yield [i, segment]
    }
  }
  /**
   * Return oldPath and newPath excluding the common part
   * @param {Path} newPath
   * @returns {number}
   */
  getCommonPathIndex(newPath) {
    const length = Math.min(this.length, newPath.length)
    for (let i = 0; i < length; i++) {
      if (!areSegmentsEqual(this.get(i), newPath.get(i))) {
        return i
      }
    }
    return length
  }
}

/**
 * Compare two pathSegments for equality
 * @param {JSONSegmentPathEncodedType|null} segment1
 * @param {JSONSegmentPathEncodedType|null} segment2
 * @returns {boolean}
 */
export function areSegmentsEqual(segment1, segment2) {
  if (segment1 === segment2) {
    // they are numbers
    return true
  }
  if (segment1 instanceof CachedString && segment2 instanceof CachedString) {
    return (
      segment1.encoded.byteLength === segment2.encoded.byteLength &&
      segment1.encoded.every(
        (value, index) => value === segment2.encoded[index],
      )
    )
  }
  return false
}

/**
 *
 * @param {JSONSegmentPathType} pathSegment
 * @returns {JSONSegmentPathEncodedType}
 */
export function toEncodedSegment(pathSegment) {
  return typeof pathSegment === "number"
    ? pathSegment
    : new CachedString(stringifyAndEncode(pathSegment))
}

/**
 *
 * @param {JSONPathType} path
 * @returns {Path}
 */
export function JSONPathToPath(path) {
  const arrayEncoded = path.map(toEncodedSegment)
  return new Path(arrayEncoded)
}
