//@ts-check
import {
  getCommonPathIndex,
  valueToBuffer,
  fromEndToIndex,
  fromIndexToEnd,
  pathSegmentTerminator,
  isPreviousPathInNewPath,
  OPEN_BRACES,
  CLOSE_BRACES,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  COMMA,
  COLON,
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

/**
 * Convert a sequence of path value pairs to a stream of bytes
 */
class SequenceToStream {
  /**
   * Convert a sequence of path value pairs to a stream of bytes
   * @param {Object} options
   * @param {(arg0: Uint8Array) => Promise<void>} options.onData - function called when a new sequence of bytes is returned
   */
  constructor({ onData }) {
    this.currentPath = new Path()
    this.onData = onData
    /** @type CONTEXT */
    this.context = CONTEXT.NULL
    this.lastWritePromise = Promise.resolve()
  }

  /**
   * @private
   * @param {Uint8Array} buffer
   */
  async _output(buffer) {
    await this.lastWritePromise
    this.lastWritePromise = this.onData(buffer)
  }
  /**
   * add a new path value pair
   * @param {Path} path - an array of path segments
   * @param {Value} value - the value at the corresponding path
   * @returns {void}
   */
  add(path, value) {
    const previousPath = this.currentPath
    this.currentPath = path

    // traverse previousPath and path
    // I get an index for the part in common
    // This way I know the common path and
    // a residual of the oldPath and newPath
    const commonPathIndex = getCommonPathIndex(previousPath, path)

    if (
      this.context === CONTEXT.NULL &&
      previousPath.length === 0 &&
      path.length > 0
    ) {
      if (typeof path.get(0) === "number") {
        this._output(OPEN_BRACKET)
      } else {
        this._output(OPEN_BRACES)
      }
    }
    if (!isPreviousPathInNewPath(previousPath, path)) {
      if (this.context === CONTEXT.OBJECT) {
        this._output(CLOSE_BRACES)
      } else if (this.context === CONTEXT.ARRAY) {
        this._output(CLOSE_BRACKET)
      }
    }
    // close all opened path in reverse order
    for (const [index, pathSegment] of fromEndToIndex(
      previousPath,
      commonPathIndex,
    )) {
      if (index === commonPathIndex) {
        this._output(COMMA)
      } else {
        this._output(pathSegmentTerminator(pathSegment))
      }
    }
    // open the new paths
    for (const [index, pathSegment] of fromIndexToEnd(path, commonPathIndex)) {
      if (typeof pathSegment === "number") {
        if (index !== commonPathIndex) {
          this._output(OPEN_BRACKET)
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
          this._output(OPEN_BRACES)
          this._output(valueToBuffer(
            pathSegment,
          ))
          this._output(COLON)
        }
      }
    }
    const v = valueToBuffer(value)
    this.context = v instanceof EmptyObj ? CONTEXT.OBJECT : v instanceof EmptyArray ? CONTEXT.ARRAY : CONTEXT.NULL
    this._output(v)
  }

  /**
   * The input stream is completed
   * @returns {Promise<void>}
   */
  async end() {
    if (this.context === CONTEXT.OBJECT) {
      this._output(CLOSE_BRACES)
    } else if (this.context === CONTEXT.ARRAY) {
      this._output(CLOSE_BRACKET)
    }
    // all opened path in reverse order
    for (const [_index, pathSegment] of fromEndToIndex(this.currentPath, 0)) {
      this._output(pathSegmentTerminator(pathSegment))
    }
    await this.lastWritePromise
  }
}

export default SequenceToStream
