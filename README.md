<h1 align="center"><span style="color: #34495e">v</span><span style="color: #41b883">u</span><span style="color: #1ed76d">m</span><span style="color: #e5e5e5">p</span></h1>
<p align="center">🚴类Vue语法的微信小程序轻量级工具库，基于原生开发标准</p>





## 特性

- [x] 基于原生开发(利用`Component`)
- [x] 数据响应增强(computed、watch)
- [x] 逻辑复用(mixins)
- [x] 状态管理(Mobx)
- [x] TypeScript支持
- [x] 基于[wxstore](https://github.com/Tencent/westore)的data diff


## 基础使用
``` javascript
import { createComponent } from "@charrue/vump";
import store from "./store"
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
  storeBindings: {
    store: store,
    fields: ["list"],
    actions: ["updateList", "resetList"],
  },
  methods: {
    onIncrease() {
      const newCount = this.data.count + 1;
      this.setData({
        count: newCount,
      });

      this.updateList(newCount)
    },
    onDecrease() {
      const newCount = this.data.count - 1;

      this.setData({
        count: newCount,
      });

      this.updateList(newCount)
    },
  },
});

```


``` javascript
// store.js
import { observable } from "@charrue/vump";

const store = observable({
  list: [],

  updateList: action(function (num) {
    this.list = [...this.list, num]
  }),

  resetList: action(function (num) {
    this.list = []
  })
})

export default store
```

``` javascript
// mixin.js
export default {
  attached() {
    this.resetList()
  }
}
```