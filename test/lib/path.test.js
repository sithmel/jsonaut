//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import { Path, JSONPathToPath, areSegmentsEqual } from "../../src/lib/path.js"
import { CachedString } from "../../src/lib/value.js"

/**
 *
 * @param {Iterable<[number, number|CachedString]>} iterable
 * @returns {Array<[number, number|string]>}
 */
function segmentIterableToArray(iterable) {
  return Array.from(iterable).map(([i, v]) => {
    if (v instanceof CachedString) {
      return [i, v.decoded]
    }
    return [i, v]
  })
}

describe("Path", () => {
  /** @type Path */
  let path
  beforeEach(() => {
    path = new Path()
    path = path.withSegmentAdded(
      new CachedString(new Uint8Array([34, 104, 101, 108, 108, 111, 34])),
    )
    path = path.withSegmentAdded(1)
    path = path.withSegmentAdded(2)
    path = path.withSegmentAdded(3)
  })
  it("decodes path", () => {
    assert.deepEqual(path.decoded, ["hello", 1, 2, 3])
  })
  it("pops and gets", () => {
    const newPath = path.withSegmentRemoved()
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
describe("Path fromEndToIndex", () => {
  it("index 0", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromEndToIndex(0)),
      [
        [2, "c"],
        [1, "b"],
        [0, "a"],
      ],
    ))
  it("index 1", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromEndToIndex(1)),
      [
        [2, "c"],
        [1, "b"],
      ],
    ))
  it("index 2", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromEndToIndex(2)),
      [[2, "c"]],
    ))
  it("index 3", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromEndToIndex(3)),
      [],
    ))
})

describe("Path fromIndexToEnd", () => {
  it("index 0", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromIndexToEnd(0)),
      [
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ],
    ))
  it("index 1", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromIndexToEnd(1)),
      [
        [1, "b"],
        [2, "c"],
      ],
    ))
  it("index 3", () =>
    assert.deepEqual(
      segmentIterableToArray(JSONPathToPath(["a", "b", "c"]).fromIndexToEnd(3)),
      [],
    ))
})
describe("Path getCommonPathIndex", () => {
  it("works with empty paths", () =>
    assert.equal(JSONPathToPath([]).getCommonPathIndex(JSONPathToPath([])), 0))
  it("works with same paths", () =>
    assert.equal(
      JSONPathToPath(["a", "b", "c"]).getCommonPathIndex(
        JSONPathToPath(["a", "b", "c"]),
      ),
      3,
    ))
  it("works with common paths (1)", () =>
    assert.equal(
      JSONPathToPath(["a", "b"]).getCommonPathIndex(
        JSONPathToPath(["a", "b", "c"]),
      ),
      2,
    ))
  it("works with common paths (2)", () =>
    assert.equal(
      JSONPathToPath([]).getCommonPathIndex(JSONPathToPath(["a", "b", "c"])),
      0,
    ))
  it("works with common paths (3)", () =>
    assert.equal(
      JSONPathToPath(["a", "b", "c"]).getCommonPathIndex(
        JSONPathToPath(["a", "b"]),
      ),
      2,
    ))
  it("works with different paths (1)", () =>
    assert.equal(
      JSONPathToPath(["a", "b", "c"]).getCommonPathIndex(
        JSONPathToPath(["x", "y"]),
      ),
      0,
    ))
  it("works with different paths (2)", () =>
    assert.equal(
      JSONPathToPath(["a", "b"]).getCommonPathIndex(
        JSONPathToPath(["x", "y", "z"]),
      ),
      0,
    ))
  it("works with different paths (3)", () =>
    assert.equal(
      JSONPathToPath(["x", "a", "b"]).getCommonPathIndex(
        JSONPathToPath(["x", "y", "z"]),
      ),
      1,
    ))
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
