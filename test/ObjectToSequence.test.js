//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"

import ObjectToSequence from "../src/ObjectToSequence.js"
import SequenceToObject from "../src/SequenceToObject.js"

describe("ObjParser", () => {
  /** @type {(arg0: any) => void} */
  let parse
  /** @type {SequenceToObject} */
  let builder
  beforeEach(() => {
    builder = new SequenceToObject()
    const parser = new ObjectToSequence()
    parse = (obj) => {
      for (const [path, value] of parser.iter(obj)) {
        builder.add(path, value)
      }
    }
  })
  it("works parsing nested objects", () => {
    const obj = { a: 1, b: 2, obj: { nested: 1 } }
    parse(obj)
    assert.deepEqual(builder.object, obj)
  })
  it("works parsing nested arrays", () => {
    const obj = { a: 1, b: 2, array: [0, 1, 2] }
    parse(obj)
    assert.deepEqual(builder.object, obj)
  })
  describe("nesting with maxDepth", () => {
    //* @type {(arg0: any) => [any, any][]} */
    let parserIter
    beforeEach(() => {
      const parser = new ObjectToSequence({ maxDepth: 1 })
      parserIter = (obj) =>
        Array.from(parser.iter(obj)).map(([path, value]) => [
          path.decoded,
          value.decoded,
        ])
    })

    it("works with object nested into object (1)", () => {
      const seq = parserIter({ test1: { test2: 1 } })
      assert.deepEqual(seq, [[["test1"], { test2: 1 }]])
    })

    it("works with object nested into object (2)", () => {
      const seq = parserIter({ test1: { test2: 1 }, test3: 2 })
      assert.deepEqual(seq, [
        [["test1"], { test2: 1 }],
        [["test3"], 2],
      ])
    })

    it("works with object nested into arrays (1)", () => {
      const seq = parserIter([{ test1: 1 }, { test2: 2 }])
      assert.deepEqual(seq, [
        [[0], { test1: 1 }],
        [[1], { test2: 2 }],
      ])
    })

    it("works with object nested into arrays (2)", () => {
      const seq = parserIter([{ test1: [1, "xyz"] }, { test2: 2 }])
      assert.deepEqual(seq, [
        [[0], { test1: [1, "xyz"] }],
        [[1], { test2: 2 }],
      ])
    })

    it("works with object nested into arrays (3)", () => {
      const seq = parserIter([
        [1, 2, 3],
        [4, 5, 6],
      ])
      assert.deepEqual(seq, [
        [[0], [1, 2, 3]],
        [[1], [4, 5, 6]],
      ])
    })
  })
})
