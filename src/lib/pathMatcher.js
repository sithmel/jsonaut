//@ts-check

import { Path, areSegmentsEqual } from "./path.js"
import { stringifyAndEncode } from "./utils.js"
import { CachedString } from "./value.js"

/**
 * create spaces for indentation
 * @private
 * @param {string} spacer
 * @param {number} level
 * @return string
 */
function indentation(spacer, level) {
  return "\n" + spacer.repeat(level)
}

/**
 * This class is used as generic container of matchers
 */
export class MatcherContainer {
  /**
   * This class is used as generic container of matchers
   * @param {Array<BaseMatcher>} [matchers]
   */
  constructor(matchers) {
    this.matchers = matchers ?? []
  }
  /**
   * Check for match
   * @param {Path} path
   * @return {boolean}
   */
  doesMatch(path) {
    if (this.matchers.length === 0) {
      return true
    }
    for (const matcher of this.matchers) {
      if (matcher.doesMatch(path, true)) {
        return true
      }
    }
    return false
  }
  /**
   * Check if matchers are exhausted
   * @return {boolean}
   */
  isExhausted() {
    if (this.matchers.length === 0) {
      return false
    }
    return this.matchers.every((m) => m.isExhausted())
  }

  /**
   * print as a string
   * @param {string?} [spacer]
   * @return {string}
   */
  stringify(spacer = null) {
    return this.matchers
      .map((m) => m.stringify(spacer, 0))
      .join(spacer == null ? " " : indentation(spacer, 0))
  }

  /**
   * return the length of the longest branch of the tree
   * @return {number}
   */
  maxLength() {
    const matcherMaxLength = this.matchers.map((m) => m.maxLength())
    return Math.max(...[0, ...matcherMaxLength])
  }
}

/**
 * Matcher base implementation
 */
export class BaseMatcher {
  /**
   * This class is used as:
   * - generic container of matchers
   * - base class for all matchers
   * - match *
   * @param {Array<BaseMatcher>} [matchers]
   */
  constructor(matchers) {
    this.matchers = matchers ?? []
    this._isExhausted = false
    this._isLastPossibleMatch = true
  }

  /**
   * Check if this specific segment matches, without checking the children
   * @param {?import("./path.js").JSONSegmentPathEncodedType} _segment
   * @param {boolean} _parentLastPossibleMatch
   * @return {boolean}
   */
  doesSegmentMatch(_segment, _parentLastPossibleMatch) {
    return false
  }

  /**
   * Check for match
   * @param {Path} path
   * @param {boolean} [parentLastPossibleMatch]
   * @return {boolean}
   */
  doesMatch(path, parentLastPossibleMatch = true) {
    if (
      path.length === 0 ||
      this.isExhausted() ||
      !this.doesSegmentMatch(path.get(0), parentLastPossibleMatch)
    ) {
      return false
    }
    if (this.matchers.length === 0) {
      return true
    }
    const newPath = path.rest()
    for (const matcher of this.matchers) {
      if (matcher.doesMatch(newPath, this._isLastPossibleMatch)) {
        return true
      }
    }
    return false
  }
  /**
   * Check if matcher is exhausted (or children)
   * @return {boolean}
   */
  isExhausted() {
    if (this._isExhausted) {
      return true
    }
    if (this.matchers.length === 0) {
      return false
    }
    return this.matchers.every((m) => m.isExhausted())
  }

  /**
   * print as a string
   * @param {string?} [spacer]
   * @param {number} [level]
   * @return {string}
   */
  stringify(spacer = null, level = 0) {
    if (this.matchers.length === 0) return ""
    const spaceBefore = spacer == null ? "" : indentation(spacer, level + 1)
    const spaceBetween = spacer == null ? " " : indentation(spacer, level + 1)
    const spaceAfter = spacer == null ? "" : indentation(spacer, level)
    return `(${spaceBefore}${this.matchers
      .map((m) => m.stringify(spacer, level + 1))
      .join(spaceBetween)}${spaceAfter})`
  }

  /**
   * return the length of the longest branch of the tree
   * @return {number}
   */
  maxLength() {
    const matcherMaxLength = this.matchers.map((m) => m.maxLength())
    return Math.max(...[0, ...matcherMaxLength]) + 1
  }
}

/**
 * @private
 */
export class AnyMatcher extends BaseMatcher {
  /**
   * Check if this specific segment matches, without checking the children
   * @param {import("../lib/path.js").JSONSegmentPathEncodedType} _segment
   * @param {boolean} _parentLastPossibleMatch
   * @return {boolean}
   */
  doesSegmentMatch(_segment, _parentLastPossibleMatch) {
    this._isLastPossibleMatch = false
    return true
  }
  /**
   * print as a string
   * @param {string?} [spacer]
   * @param {number} [level]
   * @return {string}
   */
  stringify(spacer = null, level = 0) {
    return `*${super.stringify(spacer, level)}`
  }
}

/**
 * @private
 */
export class SegmentMatcher extends BaseMatcher {
  /**
   * direct match of a number of a string
   * @param {Array<BaseMatcher>} [matchers]
   * @param {import("../lib/path.js").JSONSegmentPathType} segmentMatch
   */
  constructor(segmentMatch, matchers) {
    super(matchers)
    this.hasMatchedForLastTime = false
    this._isLastPossibleMatch = true

    this.segmentMatch = segmentMatch
    this.segmentMatchEncoded =
      typeof segmentMatch === "string"
        ? new CachedString(stringifyAndEncode(segmentMatch))
        : segmentMatch
  }
  /**
   * Check if this specific segment matches, without checking the children
   * @param {import("../lib/path.js").JSONSegmentPathEncodedType} segment
   * @param {boolean} parentLastPossibleMatch
   * @return {boolean}
   */
  doesSegmentMatch(segment, parentLastPossibleMatch) {
    this._isLastPossibleMatch = parentLastPossibleMatch

    const doesMatch = areSegmentsEqual(this.segmentMatchEncoded, segment)

    if (!doesMatch && this.hasMatchedForLastTime) {
      this._isExhausted = true
    }
    if (this._isLastPossibleMatch) {
      this.hasMatchedForLastTime = doesMatch
    }
    return doesMatch
  }
  /**
   * print as a string
   * @param {string?} [spacer]
   * @param {number} [level]
   * @return {string}
   */
  stringify(spacer = null, level = 0) {
    let segmentStr
    if (typeof this.segmentMatch === "string") {
      if (this.segmentMatch.includes("'")) {
        segmentStr = `"${this.segmentMatch}"`
      } else {
        segmentStr = `'${this.segmentMatch}'`
      }
    } else {
      segmentStr = this.segmentMatch.toString()
    }
    return `${segmentStr}${super.stringify(spacer, level)}`
  }
}

/**
 * @private
 */
export class SliceMatcher extends BaseMatcher {
  /**
   * Check for a slice (numbers only)
   * @param {{min: number, max: number}} options
   * @param {Array<BaseMatcher>} [matchers]
   */
  constructor(options, matchers) {
    super(matchers)
    this.hasMatchedForLastTime = false
    this.min = options.min ?? 0
    this.max = options.max ?? Infinity
    if (this.min >= this.max) {
      throw new Error(
        "in a slice, the min value should be smaller than the max",
      )
    }
  }
  /**
   * Check if this specific segment matches, without checking the children
   * @param {import("../lib/path.js").JSONSegmentPathEncodedType} segment
   * @param {boolean} parentLastPossibleMatch
   * @return {boolean}
   */
  doesSegmentMatch(segment, parentLastPossibleMatch) {
    if (typeof segment !== "number") {
      return false
    }
    this._isLastPossibleMatch =
      parentLastPossibleMatch && segment === this.max - 1

    const doesMatch = segment >= this.min && segment < this.max
    if (!doesMatch && this.hasMatchedForLastTime) {
      this._isExhausted = true
    }
    if (this._isLastPossibleMatch) {
      this.hasMatchedForLastTime = doesMatch
    }
    return doesMatch
  }
  /**
   * print as a string
   * @param {string?} [spacer]
   * @param {number} [level]
   * @return {string}
   */
  stringify(spacer = null, level = 0) {
    const min = this.min === 0 ? "" : this.min.toString()
    const max = this.max === Infinity ? "" : this.max.toString()
    return `${min}..${max}${super.stringify(spacer, level)}`
  }
}
