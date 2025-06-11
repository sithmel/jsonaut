/**
 * Filters an async iterable based on the `includes` expression.
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @param {AsyncIterable<Iterable<T>>} asyncIterable
 * @param {string} includes
 * @returns {AsyncIterable<Iterable<T>>}
 */
export default function includes<
  T extends [Path, Value] | [Path, Value, number, number],
>(
  asyncIterable: AsyncIterable<Iterable<T>>,
  includes: string,
): AsyncIterable<Iterable<T>>
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
//# sourceMappingURL=includes.d.ts.map
