// @ts-check
import { Path } from "../lib/path.js"
import { Value, toValueObject } from "../lib/value.js"
import SequenceToObject from "../SequenceToObject.js"

/**
 * @param {AsyncIterable<Iterable<[Path, Value] | [Path, Value, number, number]>>} asyncIterable
 * @param {Path} pathToCheck
 * @returns {AsyncIterable<Iterable<[Path, Value] | [Path, Value, number, number]>>}
 */
export default async function* group(asyncIterable, pathToCheck) {
  let groupObj = /** @type {SequenceToObject | null} */ (null)

  /**
   * @param {Iterable<[Path, Value] | [Path, Value, number, number]>} iterable
   * @returns {Iterable<[Path, Value] | [Path, Value, number, number]>}
   */
  function* inner(iterable) {
    for (const iter of iterable) {
      if (pathToCheck.getCommonPathIndex(iter[0]) === pathToCheck.length) {
        if (groupObj == null) {
          groupObj = new SequenceToObject()
        }
        groupObj.add(
          new Path(iter[0].array, iter[0].offset + pathToCheck.length),
          iter[1],
        )
      } else {
        if (groupObj != null) {
          yield [pathToCheck, toValueObject(groupObj.getObject())]
          groupObj = null
        }
        yield iter
      }
    }
  }

  for await (const batch of asyncIterable) {
    yield inner(batch)
  }
  if (groupObj !== null) {
    yield [[pathToCheck, toValueObject(groupObj.getObject())]]
  }
}
