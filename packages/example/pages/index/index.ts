import { createPage } from "@charrue/vump";
import doLogin from "../../mixins/load-mixin";
import store from "./store";

createPage({
  mixins: [doLogin],
  data: {
    motto: "Hello World",
  },
  storeBindings: {
    store,
    fields: {
      count: () => store.count,
    },
    actions: {
      increase: "increase",
    },
  },
  computed: {
    computedMotto(data) {
      return `${data.motto}!!`;
    },
  },
  onLoad() {
    this.setData({
      canIUseGetUserProfile: true,
    });
  },
  methods: {
    doIncrease() {
      this.increase(1);
    },
  },
});
