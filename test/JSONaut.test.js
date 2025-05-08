//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"

import { streamToIterable } from "../src/index.js"
import { Path } from "../src/lib/path.js"
import { Value } from "../src/lib/value.js"

/**
 * @param {[Path, Value, number, number]} pathAndValue
 * @returns {[Array<string | number>, any, number, number]}
 */
function decodePathAndValue([path, value, start, end]) {
  return [path.decoded, value.decoded, start, end]
}

/**
 * @param {Array<string>} textArray
 * @param {string} includes
 * @returns {Promise<Array<[Array<string | number>, any, number, number]>>}
 */
async function textToJSONProcessor(textArray, includes) {
  const encoder = new TextEncoder()
  const streamLike = textArray.map((text) => encoder.encode(text))
  const array = await streamToIterable(streamLike).includes(includes).toArray()
  return array.map(decodePathAndValue)
}

describe("includes", () => {
  it("works", async () => {
    const seq = await textToJSONProcessor(['{"test1":{"test2":1}}'], "'test1'('test2')")
    assert.deepEqual(seq, [[["test1", "test2"], 1, 18, 19]])
  })
})
