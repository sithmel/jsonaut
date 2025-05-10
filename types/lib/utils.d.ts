/**
 * Return true if value is an array or object
 * @private
 * @param {any} value
 * @returns {boolean}
 */
export function isArrayOrObject(value: any): boolean;
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
/**
 * @private
 * @param {Array<Uint8Array>} buffers
 * @returns {Uint8Array}
 */
export function mergeBuffers(buffers: Array<Uint8Array>): Uint8Array;
export class ParsingError extends Error {
    /**
     * @param {string} message
     * @param {number} charNumber
     */
    constructor(message: string, charNumber: number);
    charNumber: number;
}
//# sourceMappingURL=utils.d.ts.map