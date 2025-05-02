//@ts-check
import { Path } from "../lib/path.js"
import { Value } from "../lib/value.js"
import {GenericBatchIterable} from 'batch-iterable'
import includes from './includes.js'
import SequenceToObject from "../SequenceToObject.js"
import SequenceToStream from "../SequenceToStream.js"

/**
 * @extends {GenericBatchIterable<[Path, Value, number, number]>}
 */
export default class SequenceProcessor extends GenericBatchIterable {
  /**
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
   * @param {Object} options
   * @param {boolean} [options.compactArrays=false] - if true ignore array index and generates arrays without gaps
   * @returns {Promise<any>}
   */
  async toObject(options = {}) {
    const builder = await this.reduce((builder, [path, value]) => {
      builder.add(path.decoded, value.decoded)
      return builder
    }, new SequenceToObject(options))

    return builder.object 
  }

  /**
   * @param {(arg0: Uint8Array<ArrayBufferLike>) => Promise<void>} onData
   * @returns {Promise<void>}
   */
  async toStream(onData) {
    const builder = new SequenceToStream({onData})
    await this.forEach(([path, value]) => {
      builder.add(path.decoded, value.decoded)
    })

    await builder.end()
  }
}