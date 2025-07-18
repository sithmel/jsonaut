//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import {
  isArrayOrObject,
  decodeAndParse,
  stringifyAndEncode,
  areDeeplyEqual,
} from "../../src/lib/utils.js"

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

describe("areDeeplyEqual", () => {
  it("returns true for equal primitives", () => {
    assert.equal(areDeeplyEqual(1, 1), true)
    assert.equal(areDeeplyEqual("abc", "abc"), true)
    assert.equal(areDeeplyEqual(true, true), true)
    assert.equal(areDeeplyEqual(null, null), true)
    assert.equal(areDeeplyEqual(undefined, undefined), true)
  })

  it("returns false for different primitives", () => {
    assert.equal(areDeeplyEqual(1, 2), false)
    assert.equal(areDeeplyEqual("abc", "def"), false)
    assert.equal(areDeeplyEqual(true, false), false)
    assert.equal(areDeeplyEqual(null, undefined), false)
    assert.equal(areDeeplyEqual(undefined, null), false)
  })

  it("returns true for deeply equal arrays", () => {
    assert.equal(areDeeplyEqual([1, 2, 3], [1, 2, 3]), true)
    assert.equal(areDeeplyEqual([[1], [2]], [[1], [2]]), true)
    assert.equal(areDeeplyEqual([], []), true)
  })

  it("returns false for different arrays", () => {
    assert.equal(areDeeplyEqual([1, 2], [1, 2, 3]), false)
    assert.equal(areDeeplyEqual([1, 2, 3], [3, 2, 1]), false)
    assert.equal(areDeeplyEqual([1, [2]], [1, [3]]), false)
  })

  it("returns true for deeply equal objects", () => {
    assert.equal(areDeeplyEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true)
    assert.equal(areDeeplyEqual({ a: { b: 2 } }, { a: { b: 2 } }), true)
    assert.equal(areDeeplyEqual({}, {}), true)
  })

  it("returns false for different objects", () => {
    assert.equal(areDeeplyEqual({ a: 1 }, { a: 2 }), false)
    assert.equal(areDeeplyEqual({ a: 1 }, { b: 1 }), false)
    assert.equal(areDeeplyEqual({ a: { b: 2 } }, { a: { b: 3 } }), false)
    assert.equal(areDeeplyEqual({ a: 1 }, {}), false)
  })

  it("returns false for objects and arrays", () => {
    assert.equal(areDeeplyEqual({ 0: 1, 1: 2 }, [1, 2]), false)
    assert.equal(areDeeplyEqual([1, 2], { 0: 1, 1: 2 }), false)
  })
})
