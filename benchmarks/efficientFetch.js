import { streamToIterable } from "../src/index.js"
import fs from "fs"
import path from "path"
import perform from "./utils/index.js"

async function filterFile(JSONPath, lineNumber) {
  const readStream = fs.createReadStream(JSONPath)
  const obj = await streamToIterable(readStream, { maxDepth: 1 })
    .includes(`${lineNumber}`)
    .toObject()
  readStream.destroy()
  return obj
}

const JSON_PATH = path.join("test", "samples", "twitter.json")

perform(
  "Extracting 1 random tweet from a twitter file, using StreamToSequence",
  async () => {
    const lineNumber = Math.floor(Math.random() * 16000)
    const obj = await filterFile(JSON_PATH, lineNumber)
  },
)
