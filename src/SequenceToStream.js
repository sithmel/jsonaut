//@ts-check
import {
  mergeBuffers,
} from "./lib/utils.js"

import { Path } from "./lib/path.js"
import {
  CachedString,
  Value,
  EmptyArray,
  EmptyObj
} from "./lib/value.js"

/**
 * Enum for CONTEXT
 * @private
 * @readonly
 * @enum {string}
 */
const CONTEXT = {
  OBJECT: "OBJECT",
  ARRAY: "ARRAY",
  NULL: "NULL",
}

const encoder = new TextEncoder()

const OPEN_BRACES = encoder.encode("{")
const CLOSE_BRACES = encoder.encode("}")
const OPEN_BRACKET = encoder.encode("[")
const CLOSE_BRACKET = encoder.encode("]")
const COMMA = encoder.encode(",")
const COLON = encoder.encode(":")

/**
 * "}" or "]"
 * @private
 * @param {number|CachedString|null} pathSegment
 * @returns {Uint8Array}
 */
function pathSegmentTerminator(pathSegment) {
  return pathSegment instanceof CachedString ? CLOSE_BRACES : CLOSE_BRACKET
}

/**
 * Convert a sequence of path value pairs to a stream of bytes
 */
class SequenceToStream {
  /**
   * Convert a sequence of path value pairs to a stream of bytes
   * @param {Object} options
   * @param {(arg0: Uint8Array) => Promise<void>} options.onData - function called when a new sequence of bytes is returned
   */
  constructor() {
    this.currentPath = new Path()
    /** @type CONTEXT */
    this.context = CONTEXT.NULL
  }

  /**
   * add a new path value pair
   * @param {Path} path - an array of path segments
   * @param {Value} value - the value at the corresponding path
   * @returns {Uint8Array}
   */
  add(path, value) {
    /** @type {Array<Uint8Array>} */
    const buffers = []
    const previousPath = this.currentPath
    this.currentPath = path

    // traverse previousPath and path
    // I get an index for the part in common
    // This way I know the common path and
    // a residual of the oldPath and newPath
    const commonPathIndex = previousPath.getCommonPathIndex(path)

    if (
      this.context === CONTEXT.NULL &&
      previousPath.length === 0 &&
      path.length > 0
    ) {
      if (typeof path.get(0) === "number") {
        buffers.push(OPEN_BRACKET)
      } else {
        buffers.push(OPEN_BRACES)
      }
    }
    // if the previous path is not entirely contained in the new path
    // then, close the previous path
    if (previousPath.length !== commonPathIndex) {
      if (this.context === CONTEXT.OBJECT) {
        buffers.push(CLOSE_BRACES)
      } else if (this.context === CONTEXT.ARRAY) {
        buffers.push(CLOSE_BRACKET)
      }
    }
    // close all opened path in reverse order
    for (const [index, pathSegment] of previousPath.fromEndToIndex(
      commonPathIndex,
    )) {
      if (index === commonPathIndex) {
        buffers.push(COMMA)
      } else {
        buffers.push(pathSegmentTerminator(pathSegment))
      }
    }
    // open the new paths
    for (const [index, pathSegment] of path.fromIndexToEnd(commonPathIndex)) {
      if (typeof pathSegment === "number") {
        if (index !== commonPathIndex) {
          buffers.push(OPEN_BRACKET)
        }

        const previousIndex =
          index === commonPathIndex ? (previousPath.get(commonPathIndex) ?? -1) : -1
        if (previousIndex instanceof CachedString) {
          throw new Error(
            `Mixing up array index and object keys is not allowed: before ${previousIndex} then ${pathSegment} in [${path}]`,
          )
        }
        if (previousIndex >= pathSegment) {
          throw new Error(
            `Index are in the wrong order: before ${previousIndex} then ${pathSegment} in [${path}]`,
          )
        }
      } else if (pathSegment instanceof CachedString) {
        if (index !== commonPathIndex) {
          buffers.push(OPEN_BRACES)
        }
        buffers.push(pathSegment.encoded)
        buffers.push(COLON)
      }
    }
    const v = value.encoded
    this.context = v instanceof EmptyObj ? CONTEXT.OBJECT : v instanceof EmptyArray ? CONTEXT.ARRAY : CONTEXT.NULL
    buffers.push(v)
    return mergeBuffers(buffers)
  }

  /**
   * The input stream is completed
   * @returns {Uint8Array}
   */
  end() {
    /** @type {Array<Uint8Array>} */
    const buffers = []
    if (this.context === CONTEXT.OBJECT) {
      buffers.push(CLOSE_BRACES)
    } else if (this.context === CONTEXT.ARRAY) {
      buffers.push(CLOSE_BRACKET)
    }
    // all opened path in reverse order
    for (const [_index, pathSegment] of this.currentPath.fromEndToIndex(0)) {
      buffers.push(pathSegmentTerminator(pathSegment))
    }
    return mergeBuffers(buffers)
  }
}

export default SequenceToStream
