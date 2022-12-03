# Props

props仅支持在`createComponent`中使用，在`createPage`中即使声明了也无效，如果是在TypeScript中使用时会有类型错误。

## 差异性

和微信小程序原生能力的差异
- API不一致
- 不支持`observer`选项
- 微信小程序的`type`类型仅可以为 String Number Boolean Object Array 。Vump中可以给props传入自定义构造函数，在TypeScript中也会有类型提示，只不过在内部转为properties时，会统一转换为Object。


## Props声明

Vump的props能力实现是依赖于微信小程序原生[properties选项](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)。

Vump做的只是将在保持properties原有能力的基础下，将其API与Vue的propsAPI保持一致。

``` js
createComponent({
  props: {
    foo: {
      type: [String, Number],
      default: "hello world"
    }
  }
})
```

等同于

``` js
Component({
  properties: {
    foo: {
      type: String,
      optionalTypes: [Number],
      value: "hello world"
    }
  }
})

```
