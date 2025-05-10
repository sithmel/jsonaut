export default ObjectToSequence;
/**
 * Convert a js value into a sequence of path/value pairs
 */
declare class ObjectToSequence {
    /**
     * Convert a js value into a sequence of path/value pairs
     * @param {Object} [options]
     * @param {number} [options.maxDepth=Infinity] - Max parsing depth
     */
    constructor(options?: {
        maxDepth?: number | undefined;
    });
    maxDepth: number;
    /**
     * yields path/value pairs from a given object
     * @param {any} obj - Any JS value
     * @param {import("./lib/path.js").JSONPathType} [currentPath] - Only for internal use
     * @returns {Iterable<[Path, Value]>}
     */
    iter(obj: any, currentPath?: import("./lib/path.js").JSONPathType): Iterable<[Path, Value]>;
    currentPath: any[] | import("./lib/path.js").JSONSegmentPathType[] | undefined;
}
import { Path } from "./lib/path.js";
import { Value } from "./lib/value.js";
//# sourceMappingURL=ObjectToSequence.d.ts.map