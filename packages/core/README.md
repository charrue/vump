<center>
<a href="https://charrue.github.io/vump/">
  <img src="https://charrue.github.io/vump/vump.svg" />
</a>
</center>
<p align="center">🚴类Vue语法的微信小程序轻量级工具库，基于原生开发标准</p>
<a href="https://charrue.github.io/vump/">
  <h1 align="center">vump</h1>
</a>



[![npm](https://img.shields.io/npm/v/@charrue/vump)](https://www.npmjs.com/package/@charrue/vump)

## 特性

- [x] 基于原生开发(利用`Component`)
- [x] 基于`@vue/reactivity`实现了computed、watch功能(对Proxy做了[polyfill](https://github.com/GoogleChrome/proxy-polyfill))
- [x] 逻辑复用mixins
- [x] TypeScript支持
- [x] 基于[wxstore](https://github.com/Tencent/westore)的data diff
- [x] 插件功能
- [x] Composition API



### 下载

``` bash
npm install @charrue/vump @charrue/reactivity -S
```

## 使用

### 基础使用

``` javascript
import { createComponent, ref, computed, watch, onCreated, onMounted } from "@charrue/vump";

createComponent({
  props: {
    default: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const count = ref(props.default);
    const nextCount = ref(1);

    const sign = computed(() => {
      if (count.value === 0) return "";
      return count.value > 0 ? "+" : "-";
    });
    watch(count, (val) => {
      nextCount.value = val + 1;
    });

    const onIncrease = () => {
      count.value += 1;
    }
    const onDecrease = () => {
      count.value -= 1;
    }

    onCreated(() => {
      console.log("component created")
    })
    onMounted(() => {
      console.log("component attached")
    })

    return {
      count,
      sign,
      nextCount,

      onIncrease,
      onDecrease,
    }
  }
});
```

更多使用请查看[文档](https://charrue.github.io/vump/)。

