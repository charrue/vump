import { createPage } from "@charrue/vump";
import Api from "../../utils/api.js";

createPage({
  data: {
    listData: [] as any[],
  },
  onLoad() {
    this.$perf && this.$perf.mark("setData");

    this.listData = Api.getNews();

    // this.setData({ name: "11"})

    // this.setData({
    //   listData: Api.getNews()
    // }, () => {
    //   console.log("after setData")
    // })
  },
  onPullDownRefresh() {
    this.listData = Api.getNews();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);

    // this.$perf && this.$perf.mark('setData');
    // let listData = this.data.listData;
    // listData.push(...Api.getNews());
    // this.setData({
    //     listData
    // })
  },
  onReachBottom() {
    // 数据全量更新
    this.$perf && this.$perf.mark("setData");
    const { listData } = this;
    listData.push(...Api.getNews());
    this.listData = listData;
  },
});
