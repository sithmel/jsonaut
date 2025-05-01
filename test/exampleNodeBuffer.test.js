//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import StreamToSequence from "../src/StreamToSequence.js"
import SequenceToObject from "../src/SequenceToObject.js"
import fs from "fs"
import path from "path"
import { reduce } from "batch-iterable"
import streamToSequenceIncludes from "../src/streamToSequenceIncludes.js"

/**
 * @param {string} filename
 * @param {string} includes
 */
async function filterFile(filename, includes) {
  const readStream = fs.createReadStream(path.join("test", "samples", filename))
  const parser = new StreamToSequence()
  const sequence = parser.iter(readStream)
  const filteredSequence = streamToSequenceIncludes(sequence, includes)
  const builder = await reduce(filteredSequence, (builder, [path, value]) => {
    builder.add(path.decoded, value.decoded)
    return builder
  }, new SequenceToObject())

  readStream.destroy()
  return builder.object
}

describe("Example Node buffer", () => {
  it("filters", async () => {
    const obj = await filterFile("wikipedia.json", "'firstName' 'lastName'")
    assert.deepEqual(obj, {
      firstName: "John",
      lastName: "Smith",
    })
  })
})
