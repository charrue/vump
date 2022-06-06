import helper from "./tests/helper";
import ComputedBehavior from "miniprogram-computed";

// @ts-ignore 处理vitest无法识别ComputedBehavior内`Behavior`对象的问题
global.Behavior = (definition) => helper.behavior(definition);
helper.behavior(ComputedBehavior);
