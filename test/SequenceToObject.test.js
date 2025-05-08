//@ts-check
import assert from "assert"
import { describe, it } from "node:test"
import {JSONPathToPath} from "../src/lib/path.js"
import {getValueObjectFromJSONValue} from "../src/lib/value.js"
import SequenceToObject from "../src/SequenceToObject.js"

describe("SequenceToObject", () => {
  it("works with scalars", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath([]), getValueObjectFromJSONValue(true))
    assert.deepEqual(builder.object, true)
  })
  it("works with simple attributes", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["b"]), getValueObjectFromJSONValue(2))
    assert.deepEqual(builder.object, { b: 2 })
  })
  it("works with simple attributes, with structure reconstruction", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["a", 0, "b"]), getValueObjectFromJSONValue(1))
    assert.deepEqual(builder.object, { a: [{ b: 1 }] })
  })
  it("works in more complicated cases", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["a", 0, "b"]), getValueObjectFromJSONValue(1))
    builder.add(JSONPathToPath(["c", "b"]), getValueObjectFromJSONValue(3))
    assert.deepEqual(builder.object, { a: [{ b: 1 }], c: { b: 3 } })
  })
  it("compacts arrays", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["a", 3]), getValueObjectFromJSONValue(3))
    assert.deepEqual(builder.object, { a: [3] })
  })
  it("compacts arrays (2)", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["collection", 2, "brand"]), getValueObjectFromJSONValue("Rolls Royce"))
    builder.add(JSONPathToPath(["collection", 2, "number"]), getValueObjectFromJSONValue(8))
    assert.deepEqual(builder.object, {
      collection: [{ brand: "Rolls Royce", number: 8 }],
    })
  })

  it("compacts arrays (3)", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["collection", 1]), getValueObjectFromJSONValue({}))
    builder.add(JSONPathToPath(["collection", 3, "brand"]), getValueObjectFromJSONValue("Rolls Royce"))
    builder.add(JSONPathToPath(["collection", 3, "number"]), getValueObjectFromJSONValue(8))
    assert.deepEqual(builder.object, {
      collection: [{}, { brand: "Rolls Royce", number: 8 }],
    })
  })
  it("compacts arrays (4)", () => {
    const builder = new SequenceToObject()
    builder.add(JSONPathToPath(["collection", 2]), getValueObjectFromJSONValue({}))
    builder.add(JSONPathToPath(["collection2", 3, "brand"]), getValueObjectFromJSONValue("Rolls Royce"))
    builder.add(JSONPathToPath(["collection2", 4, "number"]), getValueObjectFromJSONValue(8))
    assert.deepEqual(builder.object, {
      collection2: [
        {
          brand: "Rolls Royce",
        },
        {
          number: 8,
        },
      ],
      collection: [{}],
    })
  })
  describe("chunks", () => {
    it("works with object nested into object (1)", () => {
      const builder = new SequenceToObject()
      builder.add(JSONPathToPath(["test1"]), getValueObjectFromJSONValue({ test2: 1 }))
      assert.deepEqual(builder.object, { test1: { test2: 1 } })
    })
    it("works with object nested into object (2)", () => {
      const builder = new SequenceToObject()
      builder.add(JSONPathToPath(["test1"]), getValueObjectFromJSONValue({ test2: 1 }))
      builder.add(JSONPathToPath(["test3"]), getValueObjectFromJSONValue(2))
      assert.deepEqual(builder.object, { test1: { test2: 1 }, test3: 2 })
    })
    it("works with object nested into arrays (1)", () => {
      const builder = new SequenceToObject()
      builder.add(JSONPathToPath([0]), getValueObjectFromJSONValue({ test1: 1 }))
      builder.add(JSONPathToPath([1]), getValueObjectFromJSONValue({ test2: 2 }))
      assert.deepEqual(builder.object, [{ test1: 1 }, { test2: 2 }])
    })

    it("works with object nested into arrays (2)", () => {
      const builder = new SequenceToObject()
      builder.add(JSONPathToPath([0]), getValueObjectFromJSONValue({ test1: [1, "xyz"] }))
      builder.add(JSONPathToPath([1]), getValueObjectFromJSONValue({ test2: 2 }))
      assert.deepEqual(builder.object, [{ test1: [1, "xyz"] }, { test2: 2 }])
    })
  })
})
