//@ts-check
import { decodeAndParse, stringifyAndEncode } from "./utils.js"

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
    return stringifyAndEncode(true)
  }  
}

export class False extends Value {
  /** @return {any} */
  get decoded() {
    return false
  }
  /** @return {Uint8Array} */
  get encoded() {
    return stringifyAndEncode(false)
  }  
}

export class Null extends Value {
  /** @return {any} */
  get decoded() {
    return null
  }
  /** @return {Uint8Array} */
  get encoded() {
    return stringifyAndEncode(null)
  }  
}

export class EmptyObj extends Value {
  /** @return {any} */
  get decoded() {
    return {}
  }
  /** @return {Uint8Array} */
  get encoded() {
    return stringifyAndEncode({})
  }  
}

export class EmptyArray extends Value {
  /** @return {any} */
  get decoded() {
    return []
  }
  /** @return {Uint8Array} */
  get encoded() {
    return stringifyAndEncode([])
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
