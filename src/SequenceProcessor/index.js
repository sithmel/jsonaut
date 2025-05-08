//@ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
import {GenericBatchIterable, BatchIterable} from 'batch-iterable'
import includes from './includes.js'
import SequenceToObject from "../SequenceToObject.js"
import SequenceToStream from "../SequenceToStream.js"

/**
 * @extends {GenericBatchIterable<[Path, Value, number, number] | [Path, Value]>}
 */
export default class SequenceProcessor extends GenericBatchIterable {
  /**
   * It filters the sequence based on the given expression
   * @param {string} [expression]
   * @returns {this}
   */
  includes(expression) {
    if (expression != null){
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
   * @param {(arg0: Uint8Array<ArrayBufferLike>) => Promise<void>} onData
   * @returns {Promise<void>}
   */
  async toStream(onData) {
    const builder = new SequenceToStream({onData})
    await this.forEach(([path, value]) => {
      builder.add(path, value)
    })

    await builder.end()
  }

  /**
   * Returns a general purpose batchiterable which is less strict in typing
   * but lacks methods that requires the correct types to be enforced
   * @returns {BatchIterable}
   */
  toBatchIterable() {
    return new BatchIterable(this.iterable)
  }
}
