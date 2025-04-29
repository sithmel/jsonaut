//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import { Path } from "../../src/lib/path.js"
import { CachedString } from "../../src/lib/value.js"

describe("Path", () => {
  /** @type Path */
  let path
  beforeEach(() => {
    path = new Path()
    path = path.push(
      new CachedString(
        new Uint8Array([34, 104, 101, 108, 108, 111, 34]),
      ),
    )
    path = path.push(1)
    path = path.push(2)
    path = path.push(3)
  })
  it("decodes path", () => {
    assert.deepEqual(path.decoded, ["hello", 1, 2, 3])
  })
  it("pops and gets", () => {
    const newPath = path.pop()
    assert.deepEqual(newPath.decoded, ["hello", 1, 2])
    const value = newPath.get(0)
    assert(value instanceof CachedString)
    assert.equal(value.decoded, "hello")
  })
  it("returns rest", () => {
    const newPath = path.rest()
    assert.deepEqual(newPath.decoded, [1, 2, 3])
    assert.equal(newPath.get(0), 1)
    assert.equal(newPath.length, 3)
    assert.equal(path.length, 4)
  })
})
