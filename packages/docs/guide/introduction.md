## Vump是什么

Vump是一款致力于提高小程序开发体验和开发效率的增强型微信小程序框架。
Vump是在依赖小程序原生的自有能力做的功能扩展，这意味着你可以在你的原生微信小程序项目中直接使用，无需进行编译。


## 提供了哪些能力
Vump的大部分功能受Vue的启发，基于`@vue/reactivity`开发了数据响应，computed，watch等能力。
为了使得Vue Hook的逻辑能够迁移至小程序中，我们也磨平了部分API的差异性。

## API

Charrue的组件或页面可以按两种不同的风格书写：选项式 API 和组合式 API。

### 选项式 API (Options API)
使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。

``` js
import { createComponent } from "@charrue/vump";

createComponent({
  // data可以是一个函数，也可以是一个对象
  data() {
    return {
      count: 0
    }
  },

  methods: {
    increment() {
      this.count++
    }
  },

  // 等同于 lifetimes.attached
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
})
```

### 组合式 API (Composition API)
通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。

``` js
import { createComponent, ref, onMounted } from "@charrue/vump";

createComponent({
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 用来修改状态、触发更新的函数
    function increment() {
      count.value++
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log(`The initial count is ${count.value}.`)
    })

    return {
      count,
      increment
    }
  }
})
```
