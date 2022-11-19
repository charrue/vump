import { createComponent, onCreated } from "@charrue/vump";

// const behav = Behavior({
//   lifetimes: {
//     created() {
//       console.log("Behavior created");
//     },
//     attached() {
//       console.log("Behavior attached");
//     },
//     ready() {
//       console.log("Behavior ready");
//     },
//     detached() {
//       console.log("Behavior detached");
//     },
//   },
// });

createComponent({
  setup() {
    onCreated(() => {
      console.log("component created");
    });
    return {};
  },
  // behaviors: [behav],
  // created() {
  //   console.log("component created")
  // },
  // attached() {
  //   console.log("component attached")
  // },
  // ready() {
  //   console.log("component ready")
  // },
  // detached() {
  //   console.log("component detached")
  // },
  // pageLifetimes: {
  //   show() {
  //     console.log("pageLifetime show")
  //   },
  //   hide() {
  //     console.log("pageLifetime hide")
  //   }
  // }
});
