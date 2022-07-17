import { observable, action } from "mobx-miniprogram";

const counter = observable({
  count: 10,

  increase: action(function (num = 1) {
    this.count += num;
  }),
});

export default counter;
