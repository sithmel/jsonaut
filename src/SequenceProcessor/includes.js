import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
import parseIncludes from "../lib/pathMatcherParser.js"

/**
 * @param {AsyncIterable<Iterable<[Path, Value, number, number]|[Path, Value]>>} asyncIterable
 * @param {string} includes
 * @returns {AsyncIterable<Iterable<[Path, Value, number, number]|[Path, Value]>>}
 */
export default async function * includes(asyncIterable, includes) {
  const matcher = parseIncludes(includes)

/**
 * @param {Iterable<[Path, Value, number, number]|[Path, Value]>} iterable
 * @returns {Iterable<[Path, Value, number, number]|[Path, Value]>}
 */
function * iter(iterable) {
    for (const i of iterable) {
      if (matcher.isExhausted()) break
      if (matcher.doesMatch(i[0])) {
        yield i
      }
    }
  }
  for await (const iterable of asyncIterable) {
    if (matcher.isExhausted()) break
    yield iter(iterable)
  }
}
