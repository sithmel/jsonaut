//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import SequenceToStream from "../src/SequenceToStream.js"
import ObjectToSequence from "../src/ObjectToSequence.js"
import { toPathObject } from "../src/lib/path.js"
import { toValueObject } from "../src/lib/value.js"

async function testObj(obj) {
  let str = ""
  const decoder = new TextDecoder()
  const parser = new ObjectToSequence()
  const builder = new SequenceToStream()

  for (const [path, value] of parser.iter(obj)) {
    const data = builder.add(path, value)
    str += decoder.decode(data)
  }
  const data = builder.end()
  str += decoder.decode(data)
  assert.deepEqual(JSON.parse(str), obj, str)
}

async function testSequence(sequence, obj) {
  const decoder = new TextDecoder()
  let str = ""
  const builder = new SequenceToStream()

  for (const [path, value] of sequence) {
    const data = builder.add(toPathObject(path), toValueObject(value))
    str += decoder.decode(data)
  }
  const data = builder.end()
  str += decoder.decode(data)
  assert.deepEqual(JSON.parse(str), obj, str)
}

describe("SequenceToStream: scalars", () => {
  it("works with scalars (1)", () => testObj("test"))
  it("works with scalars (2)", () => testObj(1.2))
})
describe("SequenceToStream: objects", () => {
  it("works if empty", () => testObj({}))
  it("works with 1 attribute", () => testObj({ test: 1 }))
  it("works with 1 nested objects", () => testObj({ test: { test2: 2 } }))
  it("works with multiple nested objects", () =>
    testObj({ test: { test2: { test3: 3 } } }))
  it("works with more attributes", () => testObj({ test: 1, test2: 2 }))
  it("works with multiple nested objects and attributes", () =>
    testObj({ test: { test2: { test3: 3 } }, test4: 2, test5: "hello" }))
})
describe("SequenceToStream: array", () => {
  it("works if empty", () => testObj([]))
  it("works if 1 element", () => testObj([1]))
  it("works if 2 element", () => testObj([1, "A"]))
  it("works with nested arrays", () => testObj([1, ["A", [2]], 3]))
})
describe("SequenceToStream: array and nested objects", () => {
  it("works with empty obj array", () => testObj([{}, {}]))
  it("works obj in array", () => testObj([{ test: 2 }]))
  it("works obj in array", () => testObj({ test: [1, 2, { a: 2, b: 3 }, 4] }))
})
describe("SequenceToStream: reconstruct from sequence", () => {
  it("works with 1 obj 1 attr", () => testSequence([[["a"], 1]], { a: 1 }))
  it("works with 1 obj deep paths", () =>
    testSequence([[["a", "b", "c"], true]], { a: { b: { c: true } } }))
  it("works with 1 obj more attribs", () =>
    testSequence(
      [
        [["a", "b"], true],
        [["x", "y"], false],
      ],
      { a: { b: true }, x: { y: false } },
    ))
  it("works with 1 array 1 attr", () => testSequence([[[0], 1]], [1]))
  it("works with 1 array deep paths", () =>
    testSequence([[[0, 0, 0], 1]], [[[1]]]))
  it("works with 1 array with more elements (compacting)", () =>
    testSequence(
      [
        [[0, 1], 1],
        [[1, 0], 2],
      ],
      [[1], [2]],
    ))

  it("works with mix array and obj", () =>
    testSequence(
      [
        [[0, "a", "b"], true],
        [[0, "c", "d"], false],
      ],
      [{ a: { b: true }, c: { d: false } }],
    ))

  it("compacts when missing array pieces", () => testSequence([[[2], 1]], [1]))
  it("compacts when missing array pieces(2)", () =>
    testSequence(
      [
        [[0], "a"],
        [[3], 1],
      ],
      ["a", 1],
    ))
  it("compacts arrays", () =>
    testSequence(
      [
        [["collection", 2, "brand"], "Rolls Royce"],
        [["collection", 2, "number"], 8],
      ],
      {
        collection: [{ brand: "Rolls Royce", number: 8 }],
      },
    ))
  it("reconstruct with skipping indexes", () =>
    testSequence(
      [
        [["collection", 2], {}],
        [["collection", 3, "brand"], "Rolls Royce"],
        [["collection", 3, "number"], 8],
      ],
      {
        collection: [{}, { brand: "Rolls Royce", number: 8 }],
      },
    ))
})
describe("SequenceToStream: chunks", () => {
  it("works with object nested into object (1)", () =>
    testSequence([[["test1"], { test2: 1 }]], { test1: { test2: 1 } }))
  it("works with object nested into object (2)", () =>
    testSequence(
      [
        [["test1"], { test2: 1 }],
        [["test3"], 2],
      ],
      { test1: { test2: 1 }, test3: 2 },
    ))
  it("works with object nested into arrays (1)", () =>
    testSequence(
      [
        [[0], { test1: 1 }],
        [[1], { test2: 2 }],
      ],
      [{ test1: 1 }, { test2: 2 }],
    ))
  it("works with object nested into arrays (2)", () =>
    testSequence(
      [
        [[0], { test1: [1, "xyz"] }],
        [[1], { test2: 2 }],
      ],
      [{ test1: [1, "xyz"] }, { test2: 2 }],
    ))
})
