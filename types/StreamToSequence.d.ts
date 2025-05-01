export default StreamToSequence;
/**
 * Convert a stream of characters (in chunks) to a sequence of path/value pairs
 */
declare class StreamToSequence {
    /**
     * Convert a stream of bytes (in chunks) into a sequence of path/value pairs
     * @param {Object} [options]
     * @param {number} [options.maxDepth=Infinity] - Max parsing depth
     * @param {import("./baseTypes").JSONPathType} [options.startingPath] - The parser will consider this path as it is initial (useful to resume)
     */
    constructor(options?: {
        maxDepth?: number | undefined;
        startingPath?: import("./baseTypes").JSONPathType | undefined;
    });
    currentDepthInObject: number;
    tokenizer: StreamJSONTokenizer;
    state: string;
    /** @type {Array<STATE>}
     * @private
     */
    private stateStack;
    currentPath: Path;
    stringBuffer: Uint8Array<ArrayBuffer>;
    /**
     * Generate currentPath from a path
     * @private
     * @param {import("./baseTypes").JSONPathType} path
     * @returns {Path}
     */
    private _initCurrentPath;
    /**
     * generate statestack from a path
     * @private
     * @param {import("./baseTypes").JSONPathType} path
     * @returns {Array<STATE>}
     */
    private _initStateStack;
    /**
     * add another segment to the path
     * @private
     * @param {STATE} state
     */
    private _pushState;
    /**
     * pops the parser state
     * @private
     * @returns {string}
     */
    private _popState;
    /**
     * Check if the JSON parsing completed correctly
     * @returns {boolean}
     */
    isFinished(): boolean;
    /**
   * Parse a json or json fragment from a buffer, split in chunks (ArrayBuffers)
   * and yields a sequence of path/value pairs
   * It also yields the starting and ending byte of each value
   * @param {AsyncIterable<Uint8Array>} asyncIterable - an arraybuffer that is a chunk of a stream
   * @returns {AsyncIterable<Iterable<[Path, Value, number, number]>>} - path, value, byte start, and byte end when the value is in the buffer
   */
    iter(asyncIterable: AsyncIterable<Uint8Array>): AsyncIterable<Iterable<[Path, Value, number, number]>>;
    /**
     * Parse a json or json fragment from a buffer, split in chunks (ArrayBuffers)
     * and yields a sequence of path/value pairs
     * It also yields the starting and ending byte of each value
     * @param {Uint8Array} chunk - an arraybuffer that is a chunk of a stream
     * @returns {Iterable<[Path, Value, number, number]>} - path, value, byte start, and byte end when the value is in the buffer
     */
    iterChunk(chunk: Uint8Array): Iterable<[Path, Value, number, number]>;
}
import StreamJSONTokenizer from "./StreamJSONTokenizer.js";
import { Path } from "./lib/path.js";
import { Value } from "./lib/value.js";
//# sourceMappingURL=StreamToSequence.d.ts.map