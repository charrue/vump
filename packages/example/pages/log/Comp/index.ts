import {
  reactive,
  watch,
  createComponent,
  onCreated,
  onMounted,
  onUnmounted,
  onReady,
} from "@charrue/vump";

createComponent({
  setup() {
    const calls = reactive<string[]>([]);
    onCreated(() => {
      calls.push("component created");
    });
    onMounted(() => {
      calls.push("component attached");
    });
    onReady(() => {
      calls.push("component ready");
    });
    onUnmounted(() => {
      calls.push("component detached");
    });

    watch(
      calls,
      (val) => {
        console.log(val);
      },
      { deep: true },
    );

    return {};
  },
});
