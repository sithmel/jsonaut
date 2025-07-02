import { streamToIterable, toValueObject } from "../src/index.js"
import SequenceToObject from "../src/SequenceToObject.js"
import fs from "fs"
import path from "path"
import perform from "./utils/index.js"

async function createIndex(JSONPath, indexPath) {
  const readStream = fs.createReadStream(JSONPath)
  const indexObj = await streamToIterable(readStream, { maxDepth: 1 }).reduce(
    (builder, [path, _value, start, end]) => {
      if (path.length === 1) {
        builder.add(path, toValueObject([start, end]))
      }
      return builder
    },
    new SequenceToObject(),
  )
  readStream.destroy()
  fs.writeFileSync(indexPath, JSON.stringify(indexObj.object))
}

async function filterFile(JSONPath, indexPath, lineNumber) {
  const indexReadStream = fs.createReadStream(indexPath)
  const obj = await streamToIterable(indexReadStream, { maxDepth: 1 })
    .includes(`${lineNumber}`)
    .toObject()

  const [start, end] = obj[0]

  indexReadStream.destroy()

  const JSONReadStream = fs.createReadStream(JSONPath, {
    start,
    end: end - 1,
    encoding: "utf-8",
  })
  let str = ""
  for await (const s of JSONReadStream) {
    str += s
  }
  JSONReadStream.destroy()
  const data = JSON.parse(str)
  return data
}

const JSON_PATH = path.join("test", "samples", "twitter.json")
const INDEX_PATH = path.join("test", "samples", "twitterIndex.json")

async function execute() {
  await createIndex(JSON_PATH, INDEX_PATH)
  await perform(
    "Extracting 1 random tweet from a twitter file, using StreamToSequence to create an index",
    async () => {
      const lineNumber = Math.floor(Math.random() * 16000)
      const obj = await filterFile(JSON_PATH, INDEX_PATH, lineNumber)
    },
  )
}

execute()
