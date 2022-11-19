import { createPage, ref, onShow, onMounted, onShareAppMessage } from "@charrue/vump";

createPage({
  setup() {
    const calls = ref<string[]>([]);
    onShow(() => {
      calls.value.push("page show");
    });
    onMounted(() => {
      calls.value.push("page loaded");
    });

    onShareAppMessage(() => {
      return {
        title: "自定义标题",
      };
    });

    console.log(calls);
    return {};
  },
});
