const { createComponent } = require("../../../dist/index.cjs.js");
const { record } = require("./store")

createComponent({
  data: {
    count: 0,
    nextCount: 1
  },
  computed: {
    sign(data) {
      if (data.count === 0) return "";

      return data.count > 0 ? "+" : "-";
    },
  },
  watch: {
    count(count) {
      this.setData({
        nextCount: count + 1
      })
    },
  },
  storeBindings: {
    store: record,
    fields: ["list"],
    actions: ["updateList", "resetList"],
  },
  methods: {
    onIncrease() {
      const newCount = this.data.count + 1;
      this.setData({
        count: newCount,
      });

      this.updateList(newCount)
    },
    onDecrease() {
      const newCount = this.data.count - 1;

      this.setData({
        count: newCount,
      });

      this.updateList(newCount)
    },
  },
  attached() {
    this.resetList()
  }
});
