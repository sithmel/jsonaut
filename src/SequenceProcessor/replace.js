// @ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"

/**
 * replace a value in the sequence https://datatracker.ietf.org/doc/html/rfc6902#section-4.3
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @param {AsyncIterable<Iterable<T>>} asyncIterable
 * @param {Path} path
 * @param {Value} value
 * @returns {AsyncIterable<Iterable<T>>}
 */
export default async function* replace(asyncIterable, path, value) {
  return asyncIterable
}
