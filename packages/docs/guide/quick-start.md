# 快速上手

## 依赖下载

``` bash
npm install @charrue/vump @charrue/reactivity -S
```
> 
> `@charrue/reactivity`提供了响应式功能，是基于`@vue/reactivity`和`@vue-reactivity/watch`开发的，其中增加了对Proxy的Polyfill。

依赖下载完成后为了能在微信小程序中使用需要去[构建npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

## 开始使用

**创建页面**

``` xml
<view>
  <view>{{ name }}</view>
</view>
```

``` js
import { createPage, ref } from "@charrue/vump";

createPage({
  setup() {
    const name = ref("Name");

    return {
      name,      
    }
  }
})
```

``` css
// ...
```

``` json
{
  "usingComponents": {}
}
```


**创建组件**

``` js
import { createComponent, ref } from "@charrue/vump";

createComponent({
  setup() {
    const name = ref("Name");

    return {
      name,      
    }
  }
})
```

``` json
{
  "component": true,
  "usingComponents": {}
}
```
