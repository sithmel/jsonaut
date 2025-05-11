//@ts-check
import { isArrayOrObject } from "./lib/utils.js"
import { getValueObjectFromJSONValue, emptyObjValue, emptyArrayValue, Value } from "./lib/value.js"
import { toEncodedSegment, Path } from "./lib/path.js"

/**
 * Convert a js value into a sequence of path/value pairs
 */
class ObjectToSequence {
  /**
   * Convert a js value into a sequence of path/value pairs
   * @param {Object} [options]
   * @param {number} [options.maxDepth=Infinity] - Max parsing depth
   * @param {(arg0: Path) => boolean} [options.isMaxDepthReached=null] - Max parsing depth
   */
  constructor(options = {}) {
    const { maxDepth = null, isMaxDepthReached = null } = options

    if (maxDepth != null && isMaxDepthReached != null) {
      throw new Error(
        "You can only set one of maxDepth or isMaxDepthReached",
      )
    }
    if (maxDepth != null){
      /** @type {(arg0: Path) => boolean} */
      this._isMaxDepthReached = (path) => path.length >= maxDepth
    } else if (isMaxDepthReached != null) {
      this._isMaxDepthReached = isMaxDepthReached
    } else {
      this._isMaxDepthReached = () => false
    }
  }

  /**
   * yields path/value pairs from a given object
   * @param {any} obj - Any JS value
   * @param {Path} currentPath - Only for internal use
   * @returns {Iterable<[Path, Value]>}
   */
  *iter(obj, currentPath = new Path()) {
    if (isArrayOrObject(obj) && !this._isMaxDepthReached(currentPath)) {
      let pathSegmentsAndValues
      if (Array.isArray(obj)) {
        if (obj.length === 0) {
          yield [currentPath, emptyArrayValue]
        }
        pathSegmentsAndValues = obj.map((v, i) => [i, v])
      } else {
        if (Object.keys(obj).length === 0) {
          yield [currentPath, emptyObjValue]
        }
        pathSegmentsAndValues = Object.entries(obj)
      }
      for (const [pathSegment, value] of pathSegmentsAndValues) {
        yield* this.iter(value, currentPath.withSegmentAdded(toEncodedSegment(pathSegment)))
      }
    } else {
      yield [currentPath, getValueObjectFromJSONValue(obj)]
    }
  }
}
export default ObjectToSequence
