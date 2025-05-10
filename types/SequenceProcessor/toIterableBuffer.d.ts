/**
 * Build an stream back from the sequence
 * @param {AsyncIterable<Iterable<[Path, Value]|[Path, Value, number, number]>>} asyncIterable
 * @returns {AsyncIterable<Iterable<Uint8Array>>}
 */
export function toIterableBuffer(asyncIterable: AsyncIterable<Iterable<[Path, Value] | [Path, Value, number, number]>>): AsyncIterable<Iterable<Uint8Array>>;
import { Path } from "../lib/path.js";
import { Value } from "../lib/value.js";
//# sourceMappingURL=toIterableBuffer.d.ts.map