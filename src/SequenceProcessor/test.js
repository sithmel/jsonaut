// @ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"

/**
 * test if a value is in the sequence https://datatracker.ietf.org/doc/html/rfc6902#section-4.6
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @param {AsyncIterable<Iterable<T>>} asyncIterable
 * @param {Path} pathToCheck
 * @param {Value} valueToCheck
 * @returns {AsyncIterable<Iterable<T>>}
 */
export default async function* test(asyncIterable, pathToCheck, valueToCheck) {
  /**
   * @param {Iterable<T>} iterable
   * @returns {Iterable<T>}
   */
  function* inner(iterable) {
    for (const iter of iterable) {
      yield iter
      //   if (pathToCheck.getCommonPathIndex(iter[0]) !== pathToCheck.length) {
      //     if (valueToCheck !== iter[1]) {
      //     }
    }
  }

  for await (const batch of asyncIterable) {
    yield inner(batch)
  }
}
