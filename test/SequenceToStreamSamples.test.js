//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import fs from "fs"
import path from "path"

import SequenceToStream from "../src/SequenceToStream.js"
import StreamToSequence from "../src/StreamToSequence.js"

describe("SequenceToStream sample files", () => {
  /** @type {StreamToSequence} */
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
      let str = ""
      const decoder = new TextDecoder()

      const builder = new SequenceToStream({
        onData: async (data) => {
          str += decoder.decode(data)
        },
      })
      const readStream = fs.createReadStream(
        path.join("test", "samples", filename),
      )

      const json = fs.readFileSync(path.join("test", "samples", filename), {
        encoding: "utf-8",
      })

      for await (const iterable of parser.iter(readStream)) {
        for (const [k, v] of iterable) {
          builder.add(k.decoded, v.decoded)
        }
      }

      await builder.end()
      const original = JSON.parse(json)
      const copy = JSON.parse(str)
      assert.deepEqual(original, copy)
    })
  }
})
