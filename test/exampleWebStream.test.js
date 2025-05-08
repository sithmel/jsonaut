//@ts-check
import assert from "assert"
import { describe, it, before } from "node:test"

import {streamToIterable} from "../src/index.js"


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
  await streamToIterable(readable)
    .includes(includes)
    .toStream()
    .forEach((data) => {
     writer.write(data)
  })
  controller.abort()
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
