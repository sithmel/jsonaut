//@ts-check
import { isArrayOrObject } from "./lib/utils.js"
import { getValueObjectFromJSONValue, emptyObjValue, emptyArrayValue, Value } from "./lib/value.js"
import { JSONPathToPath, Path } from "./lib/path.js"

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
   * @returns {Iterable<[Path, Value]>}
   */
  *iter(obj, currentPath = []) {
    if (isArrayOrObject(obj) && currentPath.length < this.maxDepth) {
      let pathSegmentsAndValues
      if (Array.isArray(obj)) {
        if (obj.length === 0) {
          yield [JSONPathToPath(currentPath), emptyArrayValue]
        }
        pathSegmentsAndValues = obj.map((v, i) => [i, v])
      } else {
        if (Object.keys(obj).length === 0) {
          yield [JSONPathToPath(currentPath), emptyObjValue]
        }
        pathSegmentsAndValues = Object.entries(obj)
      }
      for (const [pathSegment, value] of pathSegmentsAndValues) {
        this.currentPath = [...currentPath, pathSegment]
        yield* this.iter(value, this.currentPath)
        this.currentPath = currentPath.slice(0, -1)
      }
    } else {
      yield [JSONPathToPath(currentPath), getValueObjectFromJSONValue(obj)]
    }
  }
}
export default ObjectToSequence
