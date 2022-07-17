const { createComponent } = require("../../../dist/index.js");

const originData = {
  foo: 1,
  user: { name: 'dnt', age: 18, sex: 1 }
}

createComponent({
  data: originData,
  computed: {
    userJson(data) {
      return JSON.stringify(data.user)
    }
  },
  methods: {
    reset() {
      this.setData(originData)
    },
  },
})