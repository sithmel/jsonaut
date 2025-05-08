//@ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
import { GenericBatchIterable, BatchIterable } from "batch-iterable"
import includes from "./includes.js"
import SequenceToObject from "../SequenceToObject.js"
import SequenceToStream from "../SequenceToStream.js"
import { toStream } from "./toStream.js"
/**
 * @template {[Path, Value] | [Path, Value, number, number]} T
 * @extends {GenericBatchIterable<T>}
 */
export class GenericSequenceProcessor extends GenericBatchIterable {
  /**
   * It filters the sequence based on the given expression
   * @param {string} [expression]
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
   * @param {Object} options
   * @param {boolean} [options.compactArrays=false] - if true ignore array index and generates arrays without gaps
   * @returns {Promise<any>}
   */
  async toObject() {
    const builder = await this.reduce((builder, [path, value]) => {
      builder.add(path, value)
      return builder
    }, new SequenceToObject())

    return builder.object
  }

  /**
   * Build an stream back from the sequence
   * @returns {BatchIterable}
   */
  toStream() {
    return new BatchIterable(toStream(this.iterable))
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
