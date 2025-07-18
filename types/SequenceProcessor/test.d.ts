/**
 * test if a value is in the sequence https://datatracker.ietf.org/doc/html/rfc6902#section-4.6
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @param {AsyncIterable<Iterable<T>>} asyncIterable
 * @param {Path} pathToCheck
 * @param {Value} valueToCheck
 * @returns {AsyncIterable<Iterable<T>>}
 */
export default function test<
  T extends [Path, Value] | [Path, Value, number, number],
>(
  asyncIterable: AsyncIterable<Iterable<T>>,
  pathToCheck: Path,
  valueToCheck: Value,
): AsyncIterable<Iterable<T>>
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
//# sourceMappingURL=test.d.ts.map
