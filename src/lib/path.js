//@ts-check
import { stringifyAndEncode } from "./utils.js"
import { CachedString } from "./value.js"

/**
 * @private
 */
export class Path {
  /**
   * @param {Array<CachedString|number>} [array]
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
   * @param {CachedString|number} segment
   * @return {Path}
   */
  withSegmentedAdded(segment) {
    return new Path([...this.array, segment])
  }

  /** 
   * Return a new Path with the last segment removed
   * @return {Path} 
   */
  withSegmentedRemoved() {
    return new Path(this.array.slice(0, -1))
  }

  /**
   * @param {number} index
   * @return {?CachedString|number}
   */
  get(index) {
    return this.array[index + this.offset]
  }

  /**
   * @param {(arg0: CachedString|number) => any} func
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

  /** @return {import("../baseTypes").JSONPathType} */
  get decoded() {
    return this.map((segment) => {
      return segment instanceof CachedString
        ? segment.decoded
        : segment
    })
  }

  /** @return {Array<Uint8Array|number>} */
  get encoded() {
    return this.map((segment) => {
      return segment instanceof CachedString
        ? segment.encoded
        : segment
    })
  }
}

/**
 * 
 * @param {import("../baseTypes").JSONPathType} path 
 * @returns {Path}
 */
export function JSONPathToPath(path) {
  const arrayEncoded = path.map((v) =>
    typeof v === "number" ? v : new CachedString(stringifyAndEncode(v)),
  )
  return new Path(arrayEncoded)
}