/**
 * Compare two pathSegments for equality
 * @param {CachedString|number|null} segment1
 * @param {CachedString|number|null} segment2
 * @returns {boolean}
 */
export function areSegmentsEqual(segment1: CachedString | number | null, segment2: CachedString | number | null): boolean;
/**
 * Compare two Uint8Array objects for equality
 * @param {Uint8Array} array1
 * @param {Uint8Array} array2
 * @returns {boolean}
 */
export function areBuffersEqual(array1: Uint8Array, array2: Uint8Array): boolean;
/**
 * Check if there is a white space
 * @private
 * @param {string} c
 * @returns {boolean}
 */
export function isWhitespace(c: string): boolean;
/**
 * Return true if value is an array or object
 * @private
 * @param {any} value
 * @returns {boolean}
 */
export function isArrayOrObject(value: any): boolean;
/**
 * Return oldPath and newPath excluding the common part
 * @private
 * @param {Path} oldPath
 * @param {Path} newPath
 * @returns {number}
 */
export function getCommonPathIndex(oldPath: Path, newPath: Path): number;
/**
 * Check if oldPath is contained in the new path
 * @private
 * @param {Path} oldPath
 * @param {Path} newPath
 * @returns {boolean}
 */
export function isPreviousPathInNewPath(oldPath: Path, newPath: Path): boolean;
/**
 * Transform a value in JSON
 * @private
 * @param {Value} value
 * @returns {Uint8Array}
 */
export function valueToBuffer(value: Value): Uint8Array;
/**
 * Yields item arrays from end back to index, yield true on last
 * @private
 * @param {Path} path
 * @param {number} index
 * @returns {Iterable<[number, number|CachedString]>}
 */
export function fromEndToIndex(path: Path, index: number): Iterable<[number, number | CachedString]>;
/**
 * Yields item arrays from index to end, yield true on first
 * @private
 * @param {Path} path
 * @param {number} index
 * @returns {Iterable<[number, number|CachedString]>}
 */
export function fromIndexToEnd(path: Path, index: number): Iterable<[number, number | CachedString]>;
/**
 * "}" or "]"
 * @private
 * @param {number|CachedString|null} pathSegment
 * @returns {Uint8Array}
 */
export function pathSegmentTerminator(pathSegment: number | CachedString | null): Uint8Array;
/**
 * @private
 * @param {Uint8Array} buffer
 * @returns {any}
 */
export function decodeAndParse(buffer: Uint8Array): any;
/**
 * @private
 * @param {any} value
 * @returns {Uint8Array}
 */
export function stringifyAndEncode(value: any): Uint8Array;
export const OPEN_BRACES: Uint8Array<ArrayBufferLike>;
export const CLOSE_BRACES: Uint8Array<ArrayBufferLike>;
export const OPEN_BRACKET: Uint8Array<ArrayBufferLike>;
export const CLOSE_BRACKET: Uint8Array<ArrayBufferLike>;
export const COMMA: Uint8Array<ArrayBufferLike>;
export const COLON: Uint8Array<ArrayBufferLike>;
export class ParsingError extends Error {
    /**
     * @param {string} message
     * @param {number} charNumber
     */
    constructor(message: string, charNumber: number);
    charNumber: number;
}
import { CachedString } from "./value.js";
import { Path } from "./path.js";
import { Value } from "./value.js";
//# sourceMappingURL=utils.d.ts.map