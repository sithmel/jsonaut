//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"

import { streamToIterable, objectToIterable } from "../src/index.js"
import { Path } from "../src/lib/path.js"
import { Value } from "../src/lib/value.js"

/**
 * @param {[Path, Value, number, number] | [Path, Value]} pathAndValue
 * @returns {[Array<string | number>, any, ?number, ?number]}
 */
function decodePathAndValue([path, value, start, end]) {
  return [path.decoded, value.decoded, start ?? null, end ?? null]
}

/**
 *
 * @param {Array<string>} array
 * @returns {Iterable<Uint8Array>}
 */
function arrayOfStringsToStream(array) {
  const encoder = new TextEncoder()
  return array.map((text) => encoder.encode(text))
}

describe("streamToIterable", () => {
  it("works", async () => {
    const streamLike = arrayOfStringsToStream(['{"test1":{"te', 'st2":1}}'])
    const array = await streamToIterable(streamLike)
      .includes("'test1'('test2')")
      .toArray()
    const seq = array.map(decodePathAndValue)

    assert.deepEqual(seq, [[["test1", "test2"], 1, 18, 19]])
  })
})

describe("objectToIterable", () => {
  it("works", async () => {
    const array = await objectToIterable({ test1: { test2: 1 } })
      .includes("'test1'('test2')")
      .toArray()
    const seq = array.map(decodePathAndValue)

    assert.deepEqual(seq, [[["test1", "test2"], 1, null, null]])
  })
})
