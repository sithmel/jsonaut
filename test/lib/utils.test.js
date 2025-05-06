//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import {
  isArrayOrObject,
  getCommonPathIndex,
  valueToBuffer,
  fromEndToIndex,
  fromIndexToEnd,
  isPreviousPathInNewPath,
  decodeAndParse,
  stringifyAndEncode,
  areBuffersEqual,
  areSegmentsEqual,
  OPEN_BRACES,
  OPEN_BRACKET,
} from "../../src/lib/utils.js"

import { Path } from "../../src/lib/path.js"
import { CachedString, CachedNumber, False, EmptyArray, EmptyObj, Null } from "../../src/lib/value.js"

/**
 *
 * @param {Array<string|number>} array
 * @returns {Path}
 */
function toPath(array) {
  const encoder = new TextEncoder()
  const arrayEncoded = array.map((v) => typeof v === 'number' ? v :  new CachedString(encoder.encode(v)))
  return new Path(arrayEncoded)
}

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
describe("getCommonPathIndex", () => {
  it("works with empty paths", () =>
    assert.equal(getCommonPathIndex(toPath([]), toPath([])), 0))
  it("works with same paths", () =>
    assert.equal(
      getCommonPathIndex(toPath(["a", "b", "c"]), toPath(["a", "b", "c"])),
      3,
    ))
  it("works with common paths (1)", () =>
    assert.equal(
      getCommonPathIndex(toPath(["a", "b"]), toPath(["a", "b", "c"])),
      2,
    ))
  it("works with common paths (2)", () =>
    assert.equal(getCommonPathIndex(toPath([]), toPath(["a", "b", "c"])), 0))
  it("works with common paths (3)", () =>
    assert.equal(
      getCommonPathIndex(toPath(["a", "b", "c"]), toPath(["a", "b"])),
      2,
    ))
  it("works with different paths (1)", () =>
    assert.equal(
      getCommonPathIndex(toPath(["a", "b", "c"]), toPath(["x", "y"])),
      0,
    ))
  it("works with different paths (2)", () =>
    assert.equal(
      getCommonPathIndex(toPath(["a", "b"]), toPath(["x", "y", "z"])),
      0,
    ))
  it("works with different paths (3)", () =>
    assert.equal(
      getCommonPathIndex(toPath(["x", "a", "b"]), toPath(["x", "y", "z"])),
      1,
    ))
})
describe("valueToBuffer", () => {
  it("works with obj", () => assert.deepStrictEqual(valueToBuffer(new EmptyObj()), OPEN_BRACES))
  it("works with array", () => assert.deepStrictEqual(valueToBuffer(new EmptyArray()), OPEN_BRACKET))
  it("works with null", () => assert.deepStrictEqual(valueToBuffer(new Null()), stringifyAndEncode(null)))
  it("works with string", () => assert.deepStrictEqual(valueToBuffer(new CachedString(stringifyAndEncode("hello"))), stringifyAndEncode("hello")))
  it("works with boolean", () => assert.deepStrictEqual(valueToBuffer(new False()), stringifyAndEncode(false)))
  it("works with number", () => assert.deepStrictEqual(valueToBuffer(new CachedNumber(stringifyAndEncode(1.24))), stringifyAndEncode(1.24)))
})
describe.skip("fromEndToIndex", () => {
  it("index 0", () =>
    assert.deepEqual(Array.from(fromEndToIndex(toPath(["a", "b", "c"]), 0)), [
      [2, "c"],
      [1, "b"],
      [0, "a"],
    ]))
  it("index 1", () =>
    assert.deepEqual(Array.from(fromEndToIndex(toPath(["a", "b", "c"]), 1)), [
      [2, "c"],
      [1, "b"],
    ]))
  it("index 2", () =>
    assert.deepEqual(Array.from(fromEndToIndex(toPath(["a", "b", "c"]), 2)), [
      [2, "c"],
    ]))
  it("index 3", () =>
    assert.deepEqual(Array.from(fromEndToIndex(toPath(["a", "b", "c"]), 3)), []))
})

describe.skip("fromIndexToEnd", () => {
  it("index 0", () =>
    assert.deepEqual(Array.from(fromIndexToEnd(toPath(["a", "b", "c"]), 0)), [
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]))
  it("index 1", () =>
    assert.deepEqual(Array.from(fromIndexToEnd(toPath(["a", "b", "c"]), 1)), [
      [1, "b"],
      [2, "c"],
    ]))
  it("index 3", () =>
    assert.deepEqual(Array.from(fromIndexToEnd(toPath(["a", "b", "c"]), 3)), []))
})

describe("isPreviousPathInNewPath", () => {
  it("works on same path", () =>
    assert.equal(isPreviousPathInNewPath(toPath(["x"]), toPath(["x"])), true))
  it("works with empty paths", () =>
    assert.equal(isPreviousPathInNewPath(toPath([]), toPath([])), true))
  it("works with empty paths (2)", () =>
    assert.equal(isPreviousPathInNewPath(toPath([]), toPath(["x"])), true))
  it("works with empty paths (3)", () =>
    assert.equal(isPreviousPathInNewPath(toPath(["x"]), toPath([])), false))
  it("works with common path", () =>
    assert.equal(isPreviousPathInNewPath(toPath(["x", "y"]), toPath(["x", "y", 1])), true))
  it("works with uncommon path", () =>
    assert.equal(isPreviousPathInNewPath(toPath(["x", "y", 2]), toPath(["x", "y", 1])), false))
  it("works with uncommon path (2)", () =>
    assert.equal(isPreviousPathInNewPath(toPath(["x", "y"]), toPath(["x"])), false))
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
describe("areBuffersEqual", () => {
  it("returns true for equal buffers", () => {
    const buffer1 = new Uint8Array([1, 2, 3])
    const buffer2 = new Uint8Array([1, 2, 3])
    assert.equal(areBuffersEqual(buffer1, buffer2), true)
  })

  it("returns false for buffers with different lengths", () => {
    const buffer1 = new Uint8Array([1, 2, 3])
    const buffer2 = new Uint8Array([1, 2])
    assert.equal(areBuffersEqual(buffer1, buffer2), false)
  })

  it("returns false for buffers with different content", () => {
    const buffer1 = new Uint8Array([1, 2, 3])
    const buffer2 = new Uint8Array([1, 2, 4])
    assert.equal(areBuffersEqual(buffer1, buffer2), false)
  })

  it("returns true for empty buffers", () => {
    const buffer1 = new Uint8Array([])
    const buffer2 = new Uint8Array([])
    assert.equal(areBuffersEqual(buffer1, buffer2), true)
  })
})

describe("areSegmentsEqual", () => {
  it("returns true for equal numbers", () => {
    assert.equal(areSegmentsEqual(1, 1), true)
  })

  it("returns false for different numbers", () => {
    assert.equal(areSegmentsEqual(1, 2), false)
  })

  it("returns true for equal CachedString objects", () => {
    const encoder = new TextEncoder()
    const segment1 = new CachedString(encoder.encode("test"))
    const segment2 = new CachedString(encoder.encode("test"))
    assert.equal(areSegmentsEqual(segment1, segment2), true)
  })

  it("returns false for different CachedString objects", () => {
    const encoder = new TextEncoder()
    const segment1 = new CachedString(encoder.encode("test1"))
    const segment2 = new CachedString(encoder.encode("test2"))
    assert.equal(areSegmentsEqual(segment1, segment2), false)
  })

  it("returns false for different types", () => {
    assert.equal(areSegmentsEqual(1, null), false)
    assert.equal(
      areSegmentsEqual(null, new CachedString(new Uint8Array())),
      false,
    )
  })

  it("returns true for two null segments", () => {
    assert.equal(areSegmentsEqual(null, null), true)
  })
})
