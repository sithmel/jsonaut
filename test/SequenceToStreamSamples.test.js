//@ts-check
import assert from "assert"
import { describe, it, beforeEach } from "node:test"
import fs from "fs"
import path from "path"

import {streamToIterable} from "../src/index.js"

/**
 * 
 * @param {string} filename 
 * @returns {any}
 */
function loadJSONSync(filename) {
  const json = fs.readFileSync(path.join("test", "samples", filename), {
    encoding: "utf-8",
  })

  return JSON.parse(json)
}

describe("SequenceToStream sample files", () => {
  for (const filename of [
    "creationix.json",
    "npm.json",
    "wikipedia.json",
    "twitter.json",
  ]) {
    it(`works with ${filename}`, async () => {
      const readStream = fs.createReadStream(
        path.join("test", "samples", filename),
      )

      const decoder = new TextDecoder()


      const str = await streamToIterable(readStream).toIterableBuffer().reduce((acc, data) => {
        acc += decoder.decode(data)
        return acc
      }
      , "")

      const copy = JSON.parse(str)

      assert.deepEqual(loadJSONSync(filename), copy)
    })
  }
})
