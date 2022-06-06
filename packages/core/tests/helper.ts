import simulate from "miniprogram-simulate";
import exparser from "miniprogram-exparser";
import { resolve } from "path";

const originLoad = simulate.load;

export default {
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
