//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import {
  isArrayOrObject,
  decodeAndParse,
  stringifyAndEncode,
} from "../../src/lib/utils.js"

import { JSONPathToPath } from "../../src/lib/path.js"
import { CachedString, CachedNumber, False, EmptyArray, EmptyObj, Null } from "../../src/lib/value.js"


describe("isArrayOrObject", () => {
  it("works with plain objects", () => assert.equal(isArrayOrObject({}), true))
  it("works with arrays", () => assert.equal(isArrayOrObject([]), true))
  it("works with undefined", () =>
    assert.equal(isArrayOrObject(undefined), false))
  it("works with null", () => assert.equal(isArrayOrObject(null), false))
  it("works with 0", () => assert.equal(isArrayOrObject(0), false))
  it("works with 1", () => assert.equal(isArrayOrObject(1), false))
  it("works with empty strings", () => assert.equal(isArrayOrObject(""), false))
  it("works with strings", () => assert.equal(isArrayOrObject("xyz"), false))
  it("works with objects", () =>
    assert.equal(isArrayOrObject(new Date()), true))
})
describe("decodeAndParse stringifyAndEncode", () => {
  it("encodes", () =>
    assert.deepEqual(
      stringifyAndEncode("hello"),
      new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
    ))
  it("decodes", () =>
    assert.deepEqual(
      "hello",
      decodeAndParse(new Uint8Array([34, 104, 101, 108, 108, 111, 34])),
    ))
})
