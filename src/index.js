//@ts-check
export { default as ObjectToSequence } from "./ObjectToSequence.js"
export { default as getPathMatcher } from "./lib/pathMatcherParser.js"

import StreamToSequence from "./StreamToSequence.js"
import SequenceProcessor from "./SequenceProcessor/index.js"

/**
 * 
 * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} stream 
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @param {import("./baseTypes").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
 * @returns {SequenceProcessor}
 */
export function JSONaut(stream, options) {
  const streamToSequence = new StreamToSequence(options)
  const sequence = streamToSequence.iter(stream)
  return new SequenceProcessor(sequence)
}
