//@ts-check
import { isArrayOrObject } from "./lib/utils.js"

/**
 * Convert a js value into a sequence of path/value pairs
 */
class ObjectToSequence {
  /**
   * Convert a js value into a sequence of path/value pairs
   * @param {Object} [options]
   * @param {number} [options.maxDepth=Infinity] - Max parsing depth
   */
  constructor(options = {}) {
    const { maxDepth = Infinity } = options
    this.maxDepth = maxDepth
  }

  /**
   * yields path/value pairs from a given object
   * @param {any} obj - Any JS value
   * @param {import("./baseTypes").JSONPathType} [currentPath] - Only for internal use
   * @returns {Iterable<[import("./baseTypes").JSONPathType, import("./baseTypes").JSONValueType]>}
   */
  *iter(obj, currentPath = []) {
    if (isArrayOrObject(obj) && currentPath.length < this.maxDepth) {
      let pathSegmentsAndValues
      if (Array.isArray(obj)) {
        yield [currentPath, []]
        pathSegmentsAndValues = obj.map((v, i) => [i, v])
      } else {
        yield [currentPath, {}]
        pathSegmentsAndValues = Object.entries(obj)
      }
      for (const [pathSegment, value] of pathSegmentsAndValues) {
        this.currentPath = [...currentPath, pathSegment]
        yield* this.iter(value, this.currentPath)
        this.currentPath = currentPath.slice(0, -1)
      }
    } else {
      yield [currentPath, obj]
    }
  }
}
export default ObjectToSequence
