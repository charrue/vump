import { mergeLeft, omit, pick } from "../helper/utils";
import { HOOKS_HAS_RETURN, PAGE_LIFETIMES, COMPONENT_LIFETIMES } from "../helper/lifecycle";
import type { PlainObject, Keyof, Fn } from "../types/utils";

const LIFECYCLE_HOOKS = [...PAGE_LIFETIMES, ...COMPONENT_LIFETIMES] as const;
/**
 * @description
 * 对data选项进行合并
 *
 * 如果parent与child存在同名属性，则以parent的值优先
 *
 * parent会完全覆盖child的值
 *
 * @param parent - 父级选项的data
 * @param child - 子级选项的data
 * @returns 合并后的data
 * @example
 *
 * mergeDataOptions({ age: 10 }, { name: "vump" })
 * // => { age: 10, name: "vump" }
 *
 * mergeDataOptions({ age: 10 }, { age: 20, name: "vump" })
 * // => { age: 10, name: "vump" }
 */
export const mergeDataOptions = <PD extends PlainObject, CD extends PlainObject>(
  parent: PD = {} as any,
  child: CD = {} as any,
) => mergeLeft<PD, CD>(parent, child);

/**
 * @description
 * 对组件或页面的自定义方法进行合并，会排除掉其中的生命周期函数
 *
 * parent会完全覆盖child的值
 *
 * @param parent - 父级的method选项
 * @param child - 子级的method选项
 * @returns 合并后的method选项
 */
export const mergeMethodOptions = <PM extends PlainObject, CM extends PlainObject>(
  parent: PM,
  child: CM,
) => {
  const parentCustomMethods = omit(LIFECYCLE_HOOKS, parent);
  const childCustomMethods = omit(LIFECYCLE_HOOKS, child);
  const res = mergeLeft<typeof parentCustomMethods, typeof childCustomMethods>(
    parentCustomMethods,
    childCustomMethods,
  );
  return res;
};

/**
 * @description
 * 合并两个对象，并返回一个值为数组结构的新对象
 *
 * 对象中同名的函数将会被合并为数组
 *
 * qizh
 *
 * @param parent - 父级的method选项
 */
export const mergeMethodsToArray = <PM extends PlainObject<Fn>, CM extends PlainObject<Fn>>(
  parent: PM,
  child: CM,
) => {
  const methodMap: Record<Keyof<typeof parent> | Keyof<typeof child>, Fn[]> = {} as any;

  Object.keys(parent).forEach((key: Keyof<typeof parent>) => {
    methodMap[key] = [parent[key]];
  });

  Object.keys(child).forEach((key: Keyof<typeof child>) => {
    methodMap[key] = methodMap[key] || [];
    methodMap[key].push(child[key]);
  });

  return methodMap;
};

/**
 * 生命周期函数合并
 *
 * 如果存在同名的生命周期函数，则会合并为数组，其中父级的生命周期函数将会先执行
 * @param parent - 父级的生命周期函数
 * @param child - 子级的生命周期函数
 */
export const mergeLifecycleOptions = <P extends Record<string, any>, C extends Record<string, any>>(
  parent: P,
  child: C,
) => {
  const lifecycleCallbacks = mergeMethodsToArray(
    pick(LIFECYCLE_HOOKS, parent),
    pick(LIFECYCLE_HOOKS, child),
  );
  const composedLifecycleCallbacks: Record<Keyof<typeof lifecycleCallbacks>, Fn> = {} as any;

  (Object.keys(lifecycleCallbacks) as Keyof<typeof lifecycleCallbacks>[]).forEach(
    (lifecycleName) => {
      const callbacks = lifecycleCallbacks[lifecycleName];
      if (!Array.isArray(callbacks) || callbacks.length === 0) return;

      composedLifecycleCallbacks[lifecycleName] = function (
        query?: PlainObject<string | undefined>,
      ) {
        // 如果这个生命周期函数需要返回值，则只采用 这个生命周期函数的第一个值，即只采用parent选项中的此生命周期函数的返回值
        if (HOOKS_HAS_RETURN.indexOf(lifecycleName as typeof HOOKS_HAS_RETURN[number]) > -1) {
          return callbacks[0](query);
        }

        // callbacks 的执行顺序是 parent -> child
        for (let i = 0; i < callbacks.length; i++) {
          if (typeof callbacks[i] === "function") {
            callbacks[i].call(this, query);
          }
        }
        return undefined;
      };
    },
  );

  return composedLifecycleCallbacks;
};
