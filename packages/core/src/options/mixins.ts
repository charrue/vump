import { DataOption } from "./data";
import { MethodOption } from "./methods";
import { PropsOption } from "./props";
import { WatchOption } from "./watch";
import { ComputedOption } from "./computed";

export type MixinOption = Array<{
  data?: DataOption;
  props?: PropsOption;
  methods?: MethodOption;
  computed?: ComputedOption;
  watch?: WatchOption;
  behaviors?: WechatMiniprogram.Behavior.BehaviorIdentifier[];
  [k: string]: any;
}>;
