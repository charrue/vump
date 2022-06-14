import { diffData } from "./westore.js";

type BehaviorData = Record<string, any>;
type SetDataCallback = () => void;
type BehaviorExtend = {
  data: BehaviorData;
  setData(data: BehaviorData, callback?: SetDataCallback): void;
  diffUpdate(data: BehaviorData, callback?: SetDataCallback): void;
};

export const diffBehavior = Behavior({
  methods: {
    diffUpdate(this: BehaviorExtend, data: BehaviorData, callback?: SetDataCallback) {
      // data是需要更新的值，那么就从this.data中获取到那些需要更新的属性的原始值，然后再进行diff操作
      const prevData = Object.keys(data).reduce((acc, cur) => {
        acc[cur] = this.data[cur];
        return acc;
      }, {} as Record<string, any>);
      const patch = diffData(data, prevData);
      this.setData(patch, callback);
    },
  },
});
