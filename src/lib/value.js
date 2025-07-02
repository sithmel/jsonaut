//@ts-check
import { decodeAndParse, stringifyAndEncode, isArrayOrObject } from "./utils.js"

const FALSE_BUFFER = stringifyAndEncode(false)
const NULL_BUFFER = stringifyAndEncode(null)
const TRUE_BUFFER = stringifyAndEncode(true)
const EMPTY_OBJECT_BUFFER = stringifyAndEncode({})
const EMPTY_ARRAY_BUFFER = stringifyAndEncode([])

export class Value {
  /** @return {any} */
  get decoded() {
    throw new Error("Not implemented")
  }
  /** @return {Uint8Array} */
  get encoded() {
    throw new Error("Not implemented")
  }

  /**
   * @param {Value} _value
   * @return {boolean} */
  isEqual(_value) {
    throw new Error("Not implemented")
  }
}

export class True extends Value {
  /** @return {any} */
  get decoded() {
    return true
  }
  /** @return {Uint8Array} */
  get encoded() {
    return TRUE_BUFFER
  }

  /**
   * @param {Value} value
   * @return {boolean} */
  isEqual(value) {
    return value instanceof True
  }
}

export class False extends Value {
  /** @return {any} */
  get decoded() {
    return false
  }
  /** @return {Uint8Array} */
  get encoded() {
    return FALSE_BUFFER
  }
  /**
   * @param {Value} value
   * @return {boolean} */
  isEqual(value) {
    return value instanceof False
  }
}

export class Null extends Value {
  /** @return {any} */
  get decoded() {
    return null
  }
  /** @return {Uint8Array} */
  get encoded() {
    return NULL_BUFFER
  }
  /**
   * @param {Value} value
   * @return {boolean} */
  isEqual(value) {
    return value instanceof Null
  }
}

export class CachedValue extends Value {
  /** @param {Uint8Array} data */
  constructor(data) {
    super()
    this.data = data
    /** @type {?string} */
    this.cache = null
  }
  /** @return {any} */
  get decoded() {
    if (this.cache != null) {
      return this.cache
    }
    this.cache = decodeAndParse(this.data)
    return this.cache
  }

  /** @return {Uint8Array} */
  get encoded() {
    return this.data
  }

  /**
   * @param {Value} otherValue
   * @return {boolean} */
  isEqual(otherValue) {
    return (
      this.encoded.byteLength === otherValue.encoded.byteLength &&
      this.encoded.every((value, index) => value === otherValue.encoded[index])
    )
  }
}

export class CachedString extends CachedValue {}
export class CachedNumber extends CachedValue {}
export class CachedSubObject extends CachedValue {}

export const falseValue = new False()
export const trueValue = new True()
export const nullValue = new Null()
export const emptyObjValue = new CachedSubObject(EMPTY_OBJECT_BUFFER)
export const emptyArrayValue = new CachedSubObject(EMPTY_ARRAY_BUFFER)

/**
 *
 * @param {any} value
 * @returns {Value}
 */
export function toValueObject(value) {
  if (value == null) {
    return nullValue
  }
  if (value === true) {
    return trueValue
  }
  if (value === false) {
    return falseValue
  }
  if (isArrayOrObject(value)) {
    return new CachedSubObject(stringifyAndEncode(value))
  }
  if (typeof value === "string") {
    return new CachedString(stringifyAndEncode(value))
  }
  if (typeof value === "number") {
    return new CachedNumber(stringifyAndEncode(value))
  }
  throw new Error("Unsupported value type")
}
