//@ts-check
export { default as getPathMatcher } from "./lib/pathMatcherParser.js"
export { Path } from "./lib/path.js"
export { Value } from "./lib/value.js"

export {default as ObjectToSequence} from "./ObjectToSequence.js"
export {default as StreamToSequence} from "./StreamToSequence.js"
export {default as SequenceToObject} from "./SequenceToObject.js"
export {default as SequenceToStream} from "./SequenceToStream.js"

import StreamToSequence from "./StreamToSequence.js"
import {StreamSequenceProcessor, ObjectSequenceProcessor} from "./SequenceProcessor/index.js"
import ObjectToSequence from "./ObjectToSequence.js"
import { Path } from "./lib/path.js"
import { Value } from "./lib/value.js"

/**
 * 
 * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} stream 
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @param {import("./baseTypes").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
 * @returns {StreamSequenceProcessor}
 */
export function streamToIterable(stream, options) {
  const streamToSequence = new StreamToSequence(options)
  const sequence = streamToSequence.iter(stream)
  return new StreamSequenceProcessor(sequence)
}

/**
 * @param {Iterable<any>} iterable 
 * @return {AsyncIterable<Iterable<[Path, Value]>>} 
 */
async function * wraptIntoAsyncIterable(iterable) {
  yield iterable
}

/**
 * 
 * @param {any} obj 
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @returns {ObjectSequenceProcessor}
 */
export function objectToIterable(obj, options) {
  const objectToSequence = new ObjectToSequence(options)
  const sequence = wraptIntoAsyncIterable(objectToSequence.iter(obj))
  return new ObjectSequenceProcessor(sequence)
}

