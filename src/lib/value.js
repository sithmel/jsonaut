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
}

export class EmptyObj extends Value {
  /** @return {any} */
  get decoded() {
    return {}
  }
  /** @return {Uint8Array} */
  get encoded() {
    return EMPTY_OBJECT_BUFFER
  }  
}

export class EmptyArray extends Value {
  /** @return {any} */
  get decoded() {
    return []
  }
  /** @return {Uint8Array} */
  get encoded() {
    return EMPTY_ARRAY_BUFFER
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
}

export class CachedString extends CachedValue {}
export class CachedNumber extends CachedValue {}
export class CachedSubObject extends CachedValue {}

export const falseValue = new False()
export const trueValue = new True()
export const nullValue = new Null()
export const emptyObjValue = new EmptyObj()
export const emptyArrayValue = new EmptyArray()

/**
 * 
 * @param {any} value 
 * @returns {Value}
 */
export function getValueObjectFromJSONValue(value) {
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
    if (Array.isArray(value) && value.length === 0) {
      return emptyArrayValue
    } else if (Object.keys(value).length === 0) {
      return emptyObjValue
    }
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