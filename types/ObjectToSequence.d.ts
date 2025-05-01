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
     * @param {import("./baseTypes").JSONPathType} [currentPath] - Only for internal use
     * @returns {Iterable<[import("./baseTypes").JSONPathType, import("./baseTypes").JSONValueType]>}
     */
    iter(obj: any, currentPath?: import("./baseTypes").JSONPathType): Iterable<[import("./baseTypes").JSONPathType, import("./baseTypes").JSONValueType]>;
    currentPath: any[] | import("./baseTypes").JSONSegmentPathType[] | undefined;
}
//# sourceMappingURL=ObjectToSequence.d.ts.map