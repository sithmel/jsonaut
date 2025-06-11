//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import { CachedString } from "../../src/lib/value.js"

describe("Value", () => {
  it("decode a string", () => {
    const stringSegment = new CachedString(
      new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
    )
    assert.equal(stringSegment.decoded, "hello")
    assert.equal(stringSegment.cache, "hello")
    assert.deepEqual(
      stringSegment.encoded,
      new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
    )
  })
})
