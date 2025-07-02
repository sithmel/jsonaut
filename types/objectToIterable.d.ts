/**
 *
 * @param {any} obj
 * @param {Object} [options]
 * @param {number} [options.maxDepth=Infinity] - Max parsing depth
 * @param {(arg0: Path) => boolean} [options.isMaxDepthReached=null] - Max parsing depth
 * @returns {ObjectSequenceProcessor}
 */
export function objectToIterable(
  obj: any,
  options?: {
    maxDepth?: number | undefined
    isMaxDepthReached?: ((arg0: Path) => boolean) | undefined
  },
): ObjectSequenceProcessor
import { Path } from "./lib/path.js"
import { ObjectSequenceProcessor } from "./SequenceProcessor/index.js"
//# sourceMappingURL=objectToIterable.d.ts.map
