/**
 * @param {AsyncIterable<Iterable<[Path, Value, number, number]|[Path, Value]>>} asyncIterable
 * @param {string} includes
 * @returns {AsyncIterable<Iterable<[Path, Value, number, number]|[Path, Value]>>}
 */
export default function includes(asyncIterable: AsyncIterable<Iterable<[Path, Value, number, number] | [Path, Value]>>, includes: string): AsyncIterable<Iterable<[Path, Value, number, number] | [Path, Value]>>;
import { Path } from "../lib/path.js";
import { Value } from "../lib/value.js";
//# sourceMappingURL=includes.d.ts.map