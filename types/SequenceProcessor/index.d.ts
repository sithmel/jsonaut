/**
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @extends {GenericBatchIterable<T>}
 */
export class GenericSequenceProcessor<T extends [Path, Value] | [Path, Value, number, number]> extends GenericBatchIterable<T> {
    constructor(_iterable?: GenericBatchIterable<T> | AsyncIterable<Iterable<T>> | Iterable<Iterable<T>> | undefined);
    /**
     * It filters the sequence based on the given expression
     * @param {string|MatcherContainer} [expression]
     * @returns {this}
     */
    includes(expression?: string | MatcherContainer): this;
    /**
     * Build an object back from the sequence
     * @returns {Promise<any>}
     */
    toObject(): Promise<any>;
    /**
     * Build an stream back from the sequence
     * @returns {BatchIterable}
     */
    toIterableBuffer(): BatchIterable;
}
/**
 * @extends {GenericSequenceProcessor<[Path, Value, number, number]>}
 */
export class StreamSequenceProcessor extends GenericSequenceProcessor<[Path, Value, number, number]> {
    constructor(_iterable?: AsyncIterable<Iterable<[Path, Value, number, number]>> | GenericBatchIterable<[Path, Value, number, number]> | Iterable<Iterable<[Path, Value, number, number]>> | undefined);
}
/**
 * @extends {GenericSequenceProcessor<[Path, Value]>}
 */
export class ObjectSequenceProcessor extends GenericSequenceProcessor<[Path, Value]> {
    constructor(_iterable?: GenericBatchIterable<[Path, Value]> | AsyncIterable<Iterable<[Path, Value]>> | Iterable<Iterable<[Path, Value]>> | undefined);
}
import { Path } from "../lib/path.js";
import { Value } from "../lib/value.js";
import { GenericBatchIterable } from "batch-iterable";
import { MatcherContainer } from "../lib/pathMatcher.js";
import { BatchIterable } from "batch-iterable";
//# sourceMappingURL=index.d.ts.map