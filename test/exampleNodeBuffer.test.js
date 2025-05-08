//@ts-check
import assert from "assert"
import { describe, it } from "node:test"

import fs from "fs"
import path from "path"
import {streamToIterable} from "../src/index.js"

/**
 * @param {string} filename
 * @param {string} includes
 */
async function filterFile(filename, includes) {
  const readStream = fs.createReadStream(path.join("test", "samples", filename))
  const obj = await streamToIterable(readStream)
    .includes(includes)
    .toObject();

  readStream.destroy()
  return obj
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
