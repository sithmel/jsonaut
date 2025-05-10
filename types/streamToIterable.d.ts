/**
 *
 * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} stream
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @param {import("./lib/path.js").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
 * @returns {StreamSequenceProcessor}
 */
export function streamToIterable(stream: AsyncIterable<Uint8Array> | Iterable<Uint8Array>, options?: {
    maxDepth?: number | undefined;
    startingPath?: import("./lib/path.js").JSONPathType | undefined;
}): StreamSequenceProcessor;
import { StreamSequenceProcessor } from "./SequenceProcessor/index.js";
//# sourceMappingURL=streamToIterable.d.ts.map