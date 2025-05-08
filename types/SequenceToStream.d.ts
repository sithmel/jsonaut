export default SequenceToStream;
/**
 * Convert a sequence of path value pairs to a stream of bytes
 */
declare class SequenceToStream {
    /**
     * Convert a sequence of path value pairs to a stream of bytes
     * @param {Object} options
     * @param {(arg0: Uint8Array) => Promise<void>} options.onData - function called when a new sequence of bytes is returned
     */
    constructor({ onData }: {
        onData: (arg0: Uint8Array) => Promise<void>;
    });
    currentPath: Path;
    onData: (arg0: Uint8Array) => Promise<void>;
    /** @type CONTEXT */
    context: CONTEXT;
    lastWritePromise: Promise<void>;
    /**
     * @private
     * @param {Uint8Array} buffer
     */
    private _output;
    /**
     * add a new path value pair
     * @param {Path} path - an array of path segments
     * @param {Value} value - the value at the corresponding path
     * @returns {void}
     */
    add(path: Path, value: Value): void;
    /**
     * The input stream is completed
     * @returns {Promise<void>}
     */
    end(): Promise<void>;
}
import { Path } from "./lib/path.js";
/**
 * Enum for CONTEXT
 */
type CONTEXT = string;
declare namespace CONTEXT {
    let OBJECT: string;
    let ARRAY: string;
    let NULL: string;
}
import { Value } from "./lib/value.js";
//# sourceMappingURL=SequenceToStream.d.ts.map