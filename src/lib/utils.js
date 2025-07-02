//@ts-check

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
 * Return true if value is an array or object
 * @private
 * @param {any} value
 * @returns {boolean}
 */
export function isArrayOrObject(value) {
  return value != null && typeof value === "object"
}

const decoder = new TextDecoder("utf8", { fatal: true, ignoreBOM: true })
const encoder = new TextEncoder()
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

/**
 * @private
 * @param {Array<Uint8Array>} buffers
 * @returns {Uint8Array}
 */
export function mergeBuffers(buffers) {
  const offsets = []
  let totalSize = 0
  for (const buffer of buffers) {
    offsets.push(totalSize)
    totalSize += buffer.length
  }
  const merged = new Uint8Array(totalSize)
  let i = 0
  for (const buffer of buffers) {
    merged.set(buffer, offsets[i])
    i++
  }
  return merged
}
