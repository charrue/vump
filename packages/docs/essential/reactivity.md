# 响应式

::: tip
Vump的响应式功能在使用上与Vue类似，如果要详细了解可以去参考[响应式基础 | Vue.js](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)。
:::


## 声明响应式状态

响应式状态依赖于`@vue/reactivity`的`reactive`API实现。

选用选项式 API 时，会用 `data` 选项来声明组件的响应式状态。
此选项的值可以是一个对象或者对象的函数。


如果data返回的是一个函数，那么将会在组件`created`阶段调用此函数，并将函数返回的对象用`reactive`进行响应式包装，并在组件`attached`阶段进行调用原生的`setData`，执行视图层渲染。

此对象的所有顶层属性都会被代理到组件实例上。

> 为什么是在created阶段执行，可以参考 TODO


``` js
createPage({
  data: {
    a: 1
  }
})
```


## 计算属性

计算属性的实现依赖于`@vue/reactivity`的`computed`API实现。

在`computed`选项中声明的数据会转换为一个ComputedRef
Vump中的响应式数据


## 侦听器


侦听器的实现依赖于`@vue-reactivity/watch`的`watch`API实现。

支持的能力
- 基本数据监听
- 支持把键设置成用 . 分隔的路径
- 深层监听
- 即时侦听
- ~~改变回调的触发时机~~
