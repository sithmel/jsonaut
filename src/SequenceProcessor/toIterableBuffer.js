// @ts-check
import SequenceToStream from "../SequenceToStream.js"
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"

/**
 * Build an stream back from the sequence
 * @param {AsyncIterable<Iterable<[Path, Value]|[Path, Value, number, number]>>} asyncIterable
 * @returns {AsyncIterable<Iterable<Uint8Array>>}
 */
export async function* toIterableBuffer(asyncIterable) {
  const builder = new SequenceToStream()
  /**
   *
   * @param {Iterable<[Path, Value]|[Path, Value, number, number]>} iterable
   */
  function* iterableToStream(iterable) {
    for (const [path, value] of iterable) {
      yield builder.add(path, value)
    }
  }

  for await (const iterable of asyncIterable) {
    yield iterableToStream(iterable)
  }

  yield [builder.end()]
}
