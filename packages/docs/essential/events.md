# 事件处理


事件处理能力是原生小程序便支持的能力([组件间通信与事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html))，Vump做的仅是将其API与Vue保持一致。

``` js
createComponet({
  methods: {
    log() {
      this.$emit("foo", "message");
    }
  }
})
```

``` js
Component({
  methods: {
    log() {
      this.triggerEvent("foo", "message");
    }
  }
})
```
