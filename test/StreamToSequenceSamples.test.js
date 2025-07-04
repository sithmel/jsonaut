//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import fs from "fs"
import path from "path"

import SequenceToObject from "../src/SequenceToObject.js"
import StreamToSequence from "../src/StreamToSequence.js"

describe("StreamToSequence sample files", () => {
  let parser
  beforeEach(() => {
    parser = new StreamToSequence()
  })
  for (const filename of [
    "creationix.json",
    "npm.json",
    "wikipedia.json",
    "twitter.json",
  ]) {
    it(`works with ${filename}`, async () => {
      const builder = new SequenceToObject()
      const readStream = fs.createReadStream(
        path.join("test", "samples", filename),
      )
      const json = fs.readFileSync(path.join("test", "samples", filename), {
        encoding: "utf-8",
      })

      for await (const iterable of parser.iter(readStream)) {
        for (const [k, v] of iterable) {
          builder.add(k, v)
        }
      }
      assert.equal(parser.isFinished(), true)
      const parsed = JSON.parse(json)
      assert.deepEqual(builder.object, parsed)
    })
  }
})
