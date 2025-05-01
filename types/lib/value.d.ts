export class Value {
    /** @return {any} */
    get decoded(): any;
    /** @return {Uint8Array} */
    get encoded(): Uint8Array;
}
export class True extends Value {
}
export class False extends Value {
}
export class Null extends Value {
}
export class EmptyObj extends Value {
}
export class EmptyArray extends Value {
}
export class CachedValue extends Value {
    /** @param {Uint8Array} data */
    constructor(data: Uint8Array);
    data: Uint8Array<ArrayBufferLike>;
    /** @type {?string} */
    cache: string | null;
}
export class CachedString extends CachedValue {
}
export class CachedNumber extends CachedValue {
}
export class CachedSubObject extends CachedValue {
}
export const falseValue: False;
export const trueValue: True;
export const nullValue: Null;
export const emptyObjValue: EmptyObj;
export const emptyArrayValue: EmptyArray;
//# sourceMappingURL=value.d.ts.map