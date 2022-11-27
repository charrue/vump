import { reactive } from "@charrue/reactivity";
import { PROP_KEY, isArr, isPlainObj, isFn, hasOwn } from "../helper/index";
import { ComponentOptions } from "./types";

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

type InferPropType<T> = [T] extends [null]
  ? any // null & true would fail to infer
  : [T] extends [{ type: null | true }]
  ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
  : [T] extends [ObjectConstructor | { type: ObjectConstructor }]
  ? Record<string, any>
  : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
  ? boolean
  : [T] extends [DateConstructor | { type: DateConstructor }]
  ? Date
  : [T] extends [Array<infer U> | { type: Array<infer U> }]
  ? U extends DateConstructor
    ? Date | InferPropType<U>
    : InferPropType<U>
  : [T] extends [AllProperty<infer V>]
  ? unknown extends V
    ? IfAny<V, V, any>
    : V
  : T;

export type ExtractPropTypes<O> = {
  [K in keyof O]: InferPropType<O[K]>;
} & {
  [K in keyof O]?: InferPropType<O[K]>;
};

type PropConstructor<T = any> = { new (...args: any[]): T & {} } | { (): T } | PropMethod<T>;

type PropMethod<T, TConstructor = any> = [T] extends [((...args: any) => any) | undefined]
  ? // eslint-disable-next-line @typescript-eslint/member-ordering
    { new (): TConstructor; (): T; readonly prototype: TConstructor }
  : never;

type PropShortOptions<T> = PropConstructor<T> | Array<PropConstructor<T>>;
export interface PropObjectOptions<T> {
  type: PropShortOptions<T>;
  default?: T | (() => T);
  observer?: string | ((newVal: T, oldVal: T, changedPath: Array<string | number>) => void);
}

type AllProperty<T> = PropShortOptions<T> | PropObjectOptions<T>;

export type PropsOption = {
  [K in string]: AllProperty<any>;
};

const mpSupportPropConstructor = [String, Number, Boolean, Array, Object, null];
const checkPropType = (type: any): WechatMiniprogram.Component.PropertyType => {
  if (mpSupportPropConstructor.includes(type)) {
    return type;
  }

  return Object;
};

const formatPropType = (types: any[] | any) => {
  types = isArr(types) ? types : [types];
  return {
    type: checkPropType(types[0]),
    optionalTypes: types.slice(1).map(checkPropType),
  };
};

export const initProps = (defFields: ComponentOptions) => {
  if (!defFields.props) {
    return;
  }

  const propValues = reactive<Record<string, any>>({});
  const propKeys = Object.keys(defFields.props);
  const properties: Record<string, any> = {};
  const observers: Record<string, (value: any) => void> = {};

  propKeys.forEach((k) => {
    const propOption = defFields.props![k] as PropObjectOptions<any>;

    if (hasOwn(propOption, "default")) {
      propValues[k] = propOption.default;
    }

    observers[k] = (val: any) => {
      propValues[k] = val;
    };

    if (isArr(propOption) && propOption.length > 0) {
      properties[k] = formatPropType(propOption);
    } else if (isPlainObj(propOption)) {
      properties[k] = {
        ...formatPropType(propOption.type),
        // eslint-disable-next-line no-nested-ternary
        value: propOption.default
          ? isFn(propOption.default)
            ? propOption.default()
            : propOption.default
          : undefined,
        observer:
          propOption.observer as WechatMiniprogram.Component.FullProperty<WechatMiniprogram.Component.PropertyType>["observer"],
      };
    } else {
      properties[k] = {
        type: null,
      };
    }
  });

  defFields[PROP_KEY] = propValues;
  defFields.observers = observers;
  defFields.properties = properties;
};
