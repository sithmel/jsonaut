/**
 *
 * @param {import("../baseTypes").JSONPathType} path
 * @returns {Path}
 */
export function JSONPathToPath(path: import("../baseTypes").JSONPathType): Path;
/**
 * @private
 */
export class Path {
    /**
     * @param {Array<CachedString|number>} [array]
     * @param {number} [offset]
     */
    constructor(array?: Array<CachedString | number>, offset?: number);
    array: (number | CachedString)[];
    offset: number;
    /** @return {number}*/
    get length(): number;
    /**
     * @param {CachedString|number} segment
     * @return {Path}
    */
    push(segment: CachedString | number): Path;
    /** @return {Path} */
    pop(): Path;
    /**
     * @param {number} index
     * @return {?CachedString|number}
     */
    get(index: number): (CachedString | number) | null;
    /**
     * @param {(arg0: CachedString|number) => any} func
     * @return {Array<any>}
     */
    map(func: (arg0: CachedString | number) => any): Array<any>;
    /**
     * @return {Path}
     * */
    rest(): Path;
    /** @return {import("../baseTypes").JSONPathType} */
    get decoded(): import("../baseTypes").JSONPathType;
    /** @return {Array<Uint8Array|number>} */
    get encoded(): Array<Uint8Array | number>;
}
import { CachedString } from "./value.js";
//# sourceMappingURL=path.d.ts.map