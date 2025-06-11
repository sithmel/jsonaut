//@ts-check
import {
  ParsingError,
  decodeAndParse,
  stringifyAndEncode,
} from "./lib/utils.js"
import StreamJSONTokenizer, { TOKEN } from "./StreamJSONTokenizer.js"
import { Path } from "./lib/path.js"
import {
  CachedString,
  CachedNumber,
  CachedSubObject,
  trueValue,
  nullValue,
  falseValue,
  emptyArrayValue,
  emptyObjValue,
  Value,
} from "./lib/value.js"

/**
 * Enum for parser state
 * @private
 * @readonly
 * @enum {string}
 */
const STATE = {
  VALUE: "VALUE", // general stuff
  OPEN_OBJECT: "OPEN_OBJECT", // {
  CLOSE_OBJECT: "CLOSE_OBJECT", // }
  CLOSE_ARRAY: "CLOSE_ARRAY", // ]
  OPEN_KEY: "OPEN_KEY", // , "a"
  CLOSE_KEY: "CLOSE_KEY", // :
  END: "END", // last state
}

/**
 * Convert a stream of characters (in chunks) to a sequence of path/value pairs
 */
class StreamToSequence {
  /**
   * Convert a stream of bytes (in chunks) into a sequence of path/value pairs
   * @param {Object} [options]
   * @param {number} [options.maxDepth=null] - Max parsing depth
   * @param {(arg0: Path) => boolean} [options.isMaxDepthReached=null] - Max parsing depth
   * @param {import("./lib/path.js").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
   */
  constructor(options = {}) {
    const {
      maxDepth = null,
      isMaxDepthReached = null,
      startingPath = [],
    } = options

    if (maxDepth != null && isMaxDepthReached != null) {
      throw new Error("You can only set one of maxDepth or isMaxDepthReached")
    }
    if (maxDepth != null) {
      /** @type {(arg0: Path) => boolean} */
      this._isMaxDepthReached = (path) => path.length >= maxDepth
    } else if (isMaxDepthReached != null) {
      this._isMaxDepthReached = isMaxDepthReached
    } else {
      this._isMaxDepthReached = () => false
    }

    this.maxDepthReached = false
    this.tokenizer = new StreamJSONTokenizer()
    this.state = STATE.VALUE
    /** @type {Array<STATE>}
     * @private
     */
    this.stateStack = this._initStateStack(startingPath)
    this.currentPath = new Path() // this is the current path
    this._initCurrentPath(startingPath) // a combination of buffers (object keys) and numbers (array index)
    this.stringBuffer = new Uint8Array() // this stores strings temporarily (keys and values)

    this.emptyObjectOrArrayStart = 0 // this is used to store the start of an empty object or array
  }

  /**
   * Check if the current path is at max depth
   * @param {number | CachedString} segment
   * @returns {void}
   */
  _pushCurrentPath(segment) {
    this.currentPath = this.currentPath.withSegmentAdded(segment)
    this.maxDepthReached = this._isMaxDepthReached(this.currentPath)
  }

  /**
   * Check if the current path is at max depth
   * @returns {void}
   */
  _popCurrentPath() {
    this.currentPath = this.currentPath.withSegmentRemoved()
    this.maxDepthReached = this._isMaxDepthReached(this.currentPath)
  }

  /**
   * Generate currentPath from a path
   * @private
   * @param {import("./lib/path.js").JSONPathType} path
   */
  _initCurrentPath(path) {
    for (const segment of path) {
      this._pushCurrentPath(
        typeof segment === "string"
          ? new CachedString(stringifyAndEncode(segment))
          : segment,
      )
    }
  }

  /**
   * generate statestack from a path
   * @private
   * @param {import("./lib/path.js").JSONPathType} path
   * @returns {Array<STATE>}
   */
  _initStateStack(path) {
    const stateStack = [STATE.END]
    for (const segment of path.reverse()) {
      stateStack.push(
        typeof segment === "string" ? STATE.CLOSE_OBJECT : STATE.CLOSE_ARRAY,
      )
    }
    return stateStack
  }

  /**
   * add another segment to the path
   * @private
   * @param {STATE} state
   */
  _pushState(state) {
    this.stateStack.push(state)
  }

  /**
   * pops the parser state
   * @private
   * @returns {string}
   */
  _popState() {
    const state = this.stateStack.pop()
    if (state == null) {
      throw new Error("Invalid state")
    }
    return state
  }

  /**
   * Check if the JSON parsing completed correctly
   * @returns {boolean}
   */
  isFinished() {
    return this.state === STATE.END
  }

  /**
   * Parse a json or json fragment from a buffer, split in chunks (ArrayBuffers)
   * and yields a sequence of path/value pairs
   * It also yields the starting and ending byte of each value
   * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} asyncIterable - an arraybuffer that is a chunk of a stream
   * @returns {AsyncIterable<Iterable<[Path, Value, number, number]>>} - path, value, byte start, and byte end when the value is in the buffer
   */
  async *iter(asyncIterable) {
    for await (const chunk of asyncIterable) {
      yield this.iterChunk(chunk)
    }
  }
  /**
   * Parse a json or json fragment from a buffer, split in chunks (ArrayBuffers)
   * and yields a sequence of path/value pairs
   * It also yields the starting and ending byte of each value
   * @param {Uint8Array} chunk - an arraybuffer that is a chunk of a stream
   * @returns {Iterable<[Path, Value, number, number]>} - path, value, byte start, and byte end when the value is in the buffer
   */
  *iterChunk(chunk) {
    const iterator = this.tokenizer.iter(chunk)[Symbol.iterator]()
    while (true) {
      const result = iterator.next(this.maxDepthReached)
      if (result.done) {
        break
      }
      const [token, startToken, endToken] = result.value
      switch (this.state) {
        case STATE.VALUE: // any value
          if (token === TOKEN.STRING) {
            yield [
              this.currentPath,
              new CachedString(
                this.tokenizer.getOutputBuffer(startToken, endToken),
              ),
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else if (token === TOKEN.OPEN_BRACES) {
            this.emptyObjectOrArrayStart =
              startToken + this.tokenizer.offsetIndexFromBeginning
            this.state = STATE.OPEN_OBJECT
          } else if (token === TOKEN.OPEN_BRACKET) {
            this.emptyObjectOrArrayStart =
              startToken + this.tokenizer.offsetIndexFromBeginning
            this._pushCurrentPath(0)
            this.state = STATE.VALUE
            this._pushState(STATE.CLOSE_ARRAY)
          } else if (token === TOKEN.CLOSED_BRACKET) {
            // empty array
            this._popCurrentPath()
            yield [
              this.currentPath,
              emptyArrayValue,
              this.emptyObjectOrArrayStart,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
            this.state = this._popState()
          } else if (token === TOKEN.TRUE) {
            yield [
              this.currentPath,
              trueValue,
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else if (token === TOKEN.FALSE) {
            yield [
              this.currentPath,
              falseValue,
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else if (token === TOKEN.NULL) {
            yield [
              this.currentPath,
              nullValue,
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else if (token === TOKEN.NUMBER) {
            yield [
              this.currentPath,
              new CachedNumber(
                this.tokenizer.getOutputBuffer(startToken, endToken),
              ),
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else if (token === TOKEN.SUB_OBJECT) {
            yield [
              this.currentPath,
              new CachedSubObject(
                this.tokenizer.getOutputBuffer(startToken, endToken),
              ),
              startToken + this.tokenizer.offsetIndexFromBeginning,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]
            this.state = this._popState()
          } else {
            throw new ParsingError(
              `Invalid value ${token}`,
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break

        case STATE.OPEN_KEY: // after the "," in an object
          if (token === TOKEN.STRING) {
            this.stringBuffer = this.tokenizer.getOutputBuffer(
              startToken,
              endToken,
            )
            this.state = STATE.CLOSE_KEY
          } else {
            throw new ParsingError(
              'Malformed object. Key should start with " (after ",")',
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break

        case STATE.OPEN_OBJECT: // after the "{" in an object
          if (token === TOKEN.CLOSED_BRACES) {
            yield [
              this.currentPath,
              emptyObjValue,
              this.emptyObjectOrArrayStart,
              endToken + this.tokenizer.offsetIndexFromBeginning,
            ]

            this.state = this._popState()
            break
          }
          if (token === TOKEN.STRING) {
            this.stringBuffer = this.tokenizer.getOutputBuffer(
              startToken,
              endToken,
            )
            this.state = STATE.CLOSE_KEY
          } else {
            throw new ParsingError(
              'Malformed object. Key should start with "',
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break

        case STATE.CLOSE_KEY: // after the key is over
          if (token === TOKEN.COLON) {
            this._pushCurrentPath(new CachedString(this.stringBuffer))
            this._pushState(STATE.CLOSE_OBJECT)
            this.state = STATE.VALUE
          } else {
            throw new ParsingError(
              "Malformed object. Expecting ':' after object key",
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break

        case STATE.CLOSE_OBJECT: // after the value is parsed and the object can be closed
          if (token === TOKEN.CLOSED_BRACES) {
            this._popCurrentPath()
            this.state = this._popState()
          } else if (token === TOKEN.COMMA) {
            this._popCurrentPath()
            this.state = STATE.OPEN_KEY
          } else {
            throw new ParsingError(
              "Malformed object. Expecting '}' or ',' after object value",
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break

        case STATE.CLOSE_ARRAY: // array ready to end, or restart after the comma
          if (token === TOKEN.COMMA) {
            const previousIndex = this.currentPath.get(
              this.currentPath.length - 1,
            )
            this._popCurrentPath()
            if (typeof previousIndex !== "number") {
              throw new Error("Array index should be a number")
            }
            this._pushCurrentPath(previousIndex + 1)
            this._pushState(STATE.CLOSE_ARRAY)
            this.state = STATE.VALUE
          } else if (token === TOKEN.CLOSED_BRACKET) {
            this._popCurrentPath()
            this.state = this._popState()
          } else {
            throw new ParsingError(
              "Invalid array: " + this.state,
              startToken + this.tokenizer.offsetIndexFromBeginning,
            )
          }
          break
        case STATE.END: // last possible state
          throw new ParsingError(
            "Malformed JSON",
            startToken + this.tokenizer.offsetIndexFromBeginning,
          )
        default:
          throw new ParsingError(
            "Unknown state: " + this.state,
            startToken + this.tokenizer.offsetIndexFromBeginning,
          )
      }
    }
  }
}
export default StreamToSequence
