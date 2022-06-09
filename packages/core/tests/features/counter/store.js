const { observable, action } = require("../../../dist/index.cjs")

const record = observable({
  list: [],

  updateList: action(function (num) {
    this.list = [...this.list, num]
  }),

  resetList: action(function (num) {
    this.list = []
  })
})

exports.record = record
