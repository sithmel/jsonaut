//@ts-check
/**
 * @private
 */
import { Path } from "./path.js"
import { CachedString, Value, EmptyArray, EmptyObj } from "./value.js"

const encoder = new TextEncoder()

export const OPEN_BRACES = encoder.encode("{")
export const CLOSE_BRACES = encoder.encode("}")
export const OPEN_BRACKET = encoder.encode("[")
export const CLOSE_BRACKET = encoder.encode("]")
export const COMMA = encoder.encode(",")
export const COLON = encoder.encode(":")

export class ParsingError extends Error {
  /**
   * @param {string} message
   * @param {number} charNumber
   */
  constructor(message, charNumber) {
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParsingError)
    }

    this.name = "ParsingError"
    this.charNumber = charNumber
  }
}

/**
 * Compare two pathSegments for equality
 * @param {CachedString|number|null} segment1
 * @param {CachedString|number|null} segment2
 * @returns {boolean}
 */
export function areSegmentsEqual(segment1, segment2) {
  if (segment1 === segment2) {
    // they are numbers
    return true
  }
  if (segment1 instanceof CachedString && segment2 instanceof CachedString) {
    return areBuffersEqual(segment1.encoded, segment2.encoded)
  }
  return false
}

/**
 * Compare two Uint8Array objects for equality
 * @param {Uint8Array} array1
 * @param {Uint8Array} array2
 * @returns {boolean}
 */
export function areBuffersEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false
    }
  }
  return true
}

/**
 * Check if there is a white space
 * @private
 * @param {string} c
 * @returns {boolean}
 */
export function isWhitespace(c) {
  return c === "\n" || c === " " || c === "\r" || c === "\t"
}

/**
 * Return true if value is an array or object
 * @private
 * @param {any} value
 * @returns {boolean}
 */
export function isArrayOrObject(value) {
  return value != null && typeof value === "object"
}

/**
 * Return oldPath and newPath excluding the common part
 * @private
 * @param {Path} oldPath
 * @param {Path} newPath
 * @returns {number}
 */
export function getCommonPathIndex(oldPath, newPath) {
  const length = Math.max(oldPath.length, newPath.length)
  for (let i = 0; i < length; i++) {
    if (!areSegmentsEqual(oldPath.get(i), newPath.get(i))) {
      return i
    }
  }
  return length
}

/**
 * Check if oldPath is contained in the new path
 * @private
 * @param {Path} oldPath
 * @param {Path} newPath
 * @returns {boolean}
 */
export function isPreviousPathInNewPath(oldPath, newPath) {
  if (oldPath.length > newPath.length) return false
  const length = Math.min(oldPath.length, newPath.length)
  for (let i = 0; i < length; i++) {
    if (!areSegmentsEqual(oldPath.get(i), newPath.get(i))) {
      return false
    }
  }
  return true
}

/**
 * Transform a value in JSON
 * @private
 * @param {Value} value
 * @returns {Uint8Array}
 */
export function valueToBuffer(value) {
  if (value instanceof EmptyObj) {
    return OPEN_BRACES
  }
  if (value instanceof EmptyArray) {
    return OPEN_BRACKET
  }
  return value.encoded
}

/**
 * Yields item arrays from end back to index, yield true on last
 * @private
 * @param {Path} path
 * @param {number} index
 * @returns {Iterable<[number, number|CachedString|null]>}
 */
export function* fromEndToIndex(path, index) {
  for (let i = path.length - 1; i >= index; i--) {
    yield [i, path.get(i)]
  }
}

/**
 * Yields item arrays from index to end, yield true on first
 * @private
 * @param {Path} array
 * @param {number} index
 * @returns {Iterable<[number, number|CachedString|null]>}
 */
export function* fromIndexToEnd(array, index) {
  for (let i = index; i < array.length; i++) {
    yield [i, array.get(i)]
  }
}

/**
 * "}" or "]"
 * @private
 * @param {number|CachedString|null} pathSegment
 * @returns {Uint8Array}
 */
export function pathSegmentTerminator(pathSegment) {
  return pathSegment instanceof CachedString ? CLOSE_BRACES : CLOSE_BRACKET
}

const decoder = new TextDecoder("utf8", { fatal: true, ignoreBOM: true })
/**
 * @private
 * @param {Uint8Array} buffer
 * @returns {any}
 */
export function decodeAndParse(buffer) {
  return JSON.parse(decoder.decode(buffer))
}

/**
 * @private
 * @param {any} value
 * @returns {Uint8Array}
 */
export function stringifyAndEncode(value) {
  return encoder.encode(JSON.stringify(value))
}
