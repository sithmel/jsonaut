//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import { Path, CachedStringBuffer } from "../../src/pathExp/path.js"

describe("StringSegment and Path", () => {
  describe("StringSegment", () => {
    it("decode a string", () => {
      const stringSegment = new CachedStringBuffer(
        new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
      )
      assert.equal(stringSegment.toDecoded(), "hello")
      assert.equal(stringSegment.cache, "hello")
      assert.deepEqual(
        stringSegment.get(),
        new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
      )
    })
  })
  describe("Path", () => {
    let path
    beforeEach(() => {
      path = new Path()
      path = path.push(
        new CachedStringBuffer(
          new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
        ),
      )
      path = path.push(1)
      path = path.push(2)
      path = path.push(3)
    })
    it("decodes path", () => {
      assert.deepEqual(path.toDecoded(), ["hello", 1, 2, 3])
    })
    it("pops and gets", () => {
      const newPath = path.pop()
      assert.deepEqual(newPath.toDecoded(), ["hello", 1, 2])
      assert.equal(newPath.get(0).toDecoded(), "hello")
    })
    it("returns rest", () => {
      const newPath = path.rest()
      assert.deepEqual(newPath.toDecoded(), [1, 2, 3])
      assert.equal(newPath.get(0), 1)
      assert.equal(newPath.length, 3)
      assert.equal(path.length, 4)
    })
  })
})
