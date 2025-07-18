/**
 * replace a value in the sequence https://datatracker.ietf.org/doc/html/rfc6902#section-4.3
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @param {AsyncIterable<Iterable<T>>} asyncIterable
 * @param {Path} path
 * @param {Value} value
 * @returns {AsyncIterable<Iterable<T>>}
 */
export default function replace<
  T extends [Path, Value] | [Path, Value, number, number],
>(
  asyncIterable: AsyncIterable<Iterable<T>>,
  path: Path,
  value: Value,
): AsyncIterable<Iterable<T>>
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
//# sourceMappingURL=replace.d.ts.map
