const { createComponent, usePlugin } = require("../../../dist/index.js");

usePlugin({
  name: "bar",
  order: 10,
  behaviors: [
    Behavior({}),
  ],
});

usePlugin({
  name: "foo",
  order: -1,
  behaviors: [
    Behavior({
      lifetimes: {
        created() {
          this.setData({
            dataFromPlugin: "dataFromPlugin",
          });
        },
      },
    }),
  ],
});

createComponent({
  data: {
    count: 0,
  }
});
