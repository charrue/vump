<h1 align="center"><span style="color: #34495e">v</span><span style="color: #41b883">u</span><span style="color: #1ed76d">m</span><span style="color: #e5e5e5">p</span></h1>
<p align="center">🚴类Vue语法的微信小程序轻量级框架，基于原生开发标准</p>





## 特性

- [x] 基于原生开发(利用`Component`)
- [x] 数据响应增强(computed、watch)
- [x] 逻辑复用(mixins)
- [ ] 状态管理(Mobx)
- [x] TypeScript支持
- [ ] 周边功能支持


## 基础使用
``` javascript
import { createComponent } from "@charrue/vump"

const someMixin = {
  created() {
    console.log("someMixin created")
  },
  onShareMessage() {
    // 
  }
}

createComponent({
  mixins: [someMixin],
  data: {
    foo: "foo"
  },
  watch: {
    foo() {
      console.log("foo changed")
    }
  },
  computed: {
    computedFoo() {
      return `computed ${this.foo}`
    }
  },
  created() {
    console.log("onLoad")
    this.init()
  },
  methods: {
    init() {
      console.log("init")
    }
  }
})
```
