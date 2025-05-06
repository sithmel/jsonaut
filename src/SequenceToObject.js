//@ts-check
import { Path } from "./lib/path.js"
import { Value, CachedString } from "./lib/value.js"

/**
 * @private
 * @param {CachedString|number} pathSegment
 * @returns {{}|[]}
 */
function initObject(pathSegment) {
  return typeof pathSegment === "number" && pathSegment >= 0 ? [] : {}
}

/**
 * Convert a sequence to a js object
 */
class SequenceToObject {
  /**
   * Convert a sequence to a js object
   */
  constructor() {
    this.object = undefined
    this.lastArray = undefined
    this.lastArrayIndex = undefined
  }

  /**
   * @private
   * @param {CachedString|number|null} pathSegment
   * @param {Value} currentObject
   * @returns {CachedString|number}
   */
  _calculateRealIndex(pathSegment, currentObject) {
    if (pathSegment instanceof CachedString) {
      return pathSegment.decoded
    }
    const value = currentObject.decoded
    if (Array.isArray(value)) {
      // copy values locally
      const lastArray = this.lastArray
      const lastArrayIndex = this.lastArrayIndex
      // update with new values
      this.lastArray = value
      this.lastArrayIndex = pathSegment
      if (value === lastArray && lastArrayIndex === pathSegment) {
        return value.length - 1
      }
      return value.length
    }
    return 0
  }

  /**
   * Returns the object built out of the sequence
   * It can be called multiple times and it will return the up to date object
   * @returns {any}
   */
  getObject() {
    return this.object
  }

  /**
   * Update the object with a new path value pairs
   * @param {Path} path - an array of path segments
   * @param {Value} value - the value corresponding to the path
   * @returns {this}
   */
  add(path, value) {
    if (path.length === 0) {
      this.object = value.decoded
      return this
    }
    if (this.object === undefined) {
      const firstPathSegment = path.get(0)
      if (firstPathSegment == undefined) {
        throw new Error("Path cannot be empty empty")
      }
      this.object = initObject(firstPathSegment)
    }
    let currentObject = this.object
    for (let i = 0; i < path.length - 1; i++) {
      // ignoring type errors here:
      // if path is inconsistent with data, it should throw an exception
      const currentPathSegment = this._calculateRealIndex(
        path.get(i),
        currentObject,
      )
      const nextPathSegment = path.get(i + 1)
      // @ts-ignore
      if (currentObject[currentPathSegment] === undefined) {
        // @ts-ignore
        currentObject[currentPathSegment] = initObject(nextPathSegment)
      }
      // @ts-ignore
      currentObject = currentObject[currentPathSegment]
    }
    // @ts-ignore
    const currentPathSegment = this._calculateRealIndex(
      path.get(path.length - 1),
      currentObject,
    )
    // @ts-ignore
    currentObject[currentPathSegment] = value.decoded
    return this
  }
}
export default SequenceToObject
