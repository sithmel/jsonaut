//@ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
import { GenericBatchIterable, BatchIterable } from "batch-iterable"
import includes from "./includes.js"
import SequenceToObject from "../SequenceToObject.js"
import { toIterableBuffer } from "./toIterableBuffer.js"
import { MatcherContainer } from "../lib/pathMatcher.js"

/**
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @extends {GenericBatchIterable<T>}
 */
export class GenericSequenceProcessor extends GenericBatchIterable {
  /**
   * It filters the sequence based on the given expression
   * @param {string|MatcherContainer} [expression]
   * @returns {this}
   */
  includes(expression) {
    if (expression != null) {
      this.iterable = includes(this.iterable, expression)
    }
    return this
  }

  /**
   * Build an object back from the sequence
   * @param {any} [obj] - Options for the sequence to object conversion
   * @returns {Promise<any>}
   */
  async toObject(obj = undefined) {
    const builder = await this.reduce((builder, [path, value]) => {
      builder.add(path, value)
      return builder
    }, new SequenceToObject(obj))

    return builder.getObject()
  }

  /**
   * Build an stream back from the sequence
   * @returns {BatchIterable}
   */
  toIterableBuffer() {
    return new BatchIterable(toIterableBuffer(this.iterable))
  }
}

/**
 * @extends {GenericSequenceProcessor<[Path, Value, number, number]>}
 */
export class StreamSequenceProcessor extends GenericSequenceProcessor {}

/**
 * @extends {GenericSequenceProcessor<[Path, Value]>}
 */
export class ObjectSequenceProcessor extends GenericSequenceProcessor {}
