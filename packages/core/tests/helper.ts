import simulate from "miniprogram-simulate";
import exparser from "miniprogram-exparser";
import { resolve } from "path";
import { vumpDefaultBehavior } from "../src/componentOptions";

const originLoad = simulate.load;

const helper = {
  ...simulate,
  exparser,

  renderComponent(componentPath, ...args: any) {
    let newCompPath = componentPath;
    if (typeof componentPath === "string") {
      newCompPath = resolve(__dirname, "./features", componentPath);
    }
    const compId = originLoad(newCompPath, ...args);
    const comp = simulate.render(compId);

    const parent = document.createElement("parent-wrapper");
    // ! 很重要, 触发组件的`attached`生命周期，computed behavior 会在此阶段做状态的更新
    comp.attach(parent);
    return comp;
  },
};

export const createComponent = (options: Record<string, any> = {}) => {
  const componentId = helper.load({
    template: "<view></view>",
    behaviors: [vumpDefaultBehavior],
    ...options,
  });

  const component = helper.render(componentId);
  const parent = document.createElement("parent-wrapper");
  component.attach(parent);

  return {
    component,
    instance: component.instance as any,
  };
};

export default helper;
