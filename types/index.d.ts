/**
 *
 * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} stream
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @param {import("./baseTypes").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
 * @returns {SequenceProcessor}
 */
export function streamToIterable(stream: AsyncIterable<Uint8Array> | Iterable<Uint8Array>, options?: {
    maxDepth?: number | undefined;
    startingPath?: import("./baseTypes").JSONPathType | undefined;
}): SequenceProcessor;
/**
 *
 * @param {any} obj
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @returns {SequenceProcessor}
 */
export function objectToIterable(obj: any, options?: {
    maxDepth?: number | undefined;
}): SequenceProcessor;
export { default as getPathMatcher } from "./lib/pathMatcherParser.js";
export { Path } from "./lib/path.js";
export { Value } from "./lib/value.js";
export { default as ObjectToSequence } from "./ObjectToSequence.js";
export { default as StreamToSequence } from "./StreamToSequence.js";
export { default as SequenceToObject } from "./SequenceToObject.js";
export { default as SequenceToStream } from "./SequenceToStream.js";
import SequenceProcessor from "./SequenceProcessor/index.js";
//# sourceMappingURL=index.d.ts.map