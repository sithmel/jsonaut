//@ts-check
import assert from "assert"
import { describe, it, before } from "node:test"

import StreamToSequence from "../src/StreamToSequence.js"
import SequenceToStream from "../src/SequenceToStream.js"
import { forEach } from "batch-iterable"
import streamToSequenceIncludes from "../src/streamToSequenceIncludes.js"


/**
 * @param {{text:string}} output
 * @returns {WritableStream}
 */
function getTestWritableStream(output) {
  output.text = ""
  const decoder = new TextDecoder()
  const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })

  return new WritableStream(
    {
      /**
       * @param {AllowSharedBufferSource} chunk
       * @returns {Promise<void>}
       */
      write(chunk) {
        return new Promise((resolve, reject) => {
          const decoded = decoder.decode(chunk, { stream: true })
          output.text += decoded
          resolve()
        })
      },
    },
    queuingStrategy,
  )
}

/**
 * @param {ReadableStream} readable
 * @param {WritableStream} writable
 * @param {string} includes
 * @param {AbortController} controller
 */
async function filterJSONStream(readable, writable, includes, controller) {
  const writer = writable.getWriter()

  const parser = new StreamToSequence()
  const sequence = parser.iter(readable)
  const filteredSequence = streamToSequenceIncludes(sequence, includes)

  const builder = new SequenceToStream({
    onData: async (data) => writer.write(data),
  })

  await forEach(filteredSequence, ([path, value]) => {
    builder.add(path.decoded, value.decoded)
  })

  controller.abort()
  await builder.end()
}

describe("Example web stream", () => {
  let testStream
  before(() => {
    testStream = new Blob(['{"hello": "world", "test": 1}'], {
      type: "text/plain",
    }).stream()
  })
  it("filters", async () => {
    const controller = new AbortController()
    const signal = controller.signal
    const output = { text: "" }
    const writable = getTestWritableStream(output)
    await filterJSONStream(testStream, writable, "'test'", controller)
    assert.equal(output.text, '{"test":1}')
  })
})
