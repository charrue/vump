<h1 align="center"><span style="color: #34495e">vump</span></h1>
<p align="center">🚴类Vue语法的微信小程序轻量级工具库，基于原生开发标准</p>





## 特性

- [x] 基于原生开发(利用`Component`)
- [x] 数据响应增强(computed、watch)
- [x] 逻辑复用(mixins)
- [ ] ~~状态管理(Mobx)~~**(0.1.5可用，0.2.0开始弃用，如要使用可利用插件功能自行配置)**
- [x] TypeScript支持
- [x] 基于[wxstore](https://github.com/Tencent/westore)的data diff
- [x] 插件功能



### 下载

``` bash
npm install @charrue/vump
```



## 使用

### 基础使用
``` javascript
// counter.js
import { createComponent } from "@charrue/vump";
import mixin from "./mixin"

createComponent({
  mixins: [mixin],
  data: {
    count: 0,
    nextCount: 1
  },
  computed: {
    sign(data) {
      if (data.count === 0) return "";

      return data.count > 0 ? "+" : "-";
    },
  },
  watch: {
    count(count) {
      this.setData({
        nextCount: count + 1
      })
    },
  },
  methods: {
    onIncrease() {
      const newCount = this.data.count + 1;
      this.setData({
        count: newCount,
      });

    },
    onDecrease() {
      const newCount = this.data.count - 1;

      this.setData({
        count: newCount,
      });
    },
  },
});

```

``` javascript
// mixin.js
export default {
  attached() {
    this.resetList()
  }
}
```



### 插件使用

```
npm install --save mobx-miniprogram mobx-miniprogram-bindings
```

``` javascript
// app.js
import { usePlugin } from "@charrue/vump";
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";

usePlugin({
  behaviors: [storeBindingsBehavior],
})

App({})
```


``` javascript
// counter.js
import { createComponent } from "@charrue/vump";

import { store } from "./store";

createComponent({
  data: {
    someData: "...",
  },
  storeBindings: {
    store,
    fields: {
      numA: () => store.numA,
      numB: (store) => store.numB,
      sum: "sum",
    },
    actions: {
      buttonTap: "update",
    },
  },
  methods: {
    myMethod() {
      this.data.sum; // 来自于 MobX store 的字段
    },
  },
});

```