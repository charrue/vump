const { createComponent } = require("../../../dist/index.cjs.js");

createComponent({
  data: {
    count: 0,
  },
  computed: {
    sign(data) {
      if (data.count === 0) return "";

      return data.count > 0 ? "+" : "-";
    },
  },
  methods: {
    onIncrease() {
      this.setData({
        count: this.data.count + 1,
      });
    },
    onDecrease() {
      this.setData({
        count: this.data.count - 1,
      });
    },
  },
});
