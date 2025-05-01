export default class SequenceProcessor {
    /**
     * @param {AsyncIterable<Iterable<[Path, Value, number, number]>>} iterable
     */
    constructor(iterable: AsyncIterable<Iterable<[Path, Value, number, number]>>);
    /**
     * @param {string} expression
     * @returns {AsyncIterable<Iterable<[Path, Value, number, number]>>}
     */
    includes(expression: string): AsyncIterable<Iterable<[Path, Value, number, number]>>;
}
import { Path } from "../lib/path.js";
import { Value } from "../lib/value.js";
//# sourceMappingURL=index.d.ts.map