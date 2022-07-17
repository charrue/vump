const { createComponent } = require("../../../dist/index.js");

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
  methods: {
    onIncrease() {
      const newCount = this.data.count + 1;
      this.setData({
        count: newCount,
      });
    },
    onDecrease() {
      const newCount = this.data.count - 1;

      this.setData({
        count: newCount,
      });
    },
  },
});
