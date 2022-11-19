import { DataOption } from "./data";
import { MethodOption } from "./methods";
import { PropertyOption } from "./props";
import { WatchOption } from "./watch";
import { ComputedOption } from "./computed";

export type MixinOption = Array<{
  data?: DataOption;
  properties?: PropertyOption;
  methods?: MethodOption;
  computed?: ComputedOption;
  watch?: WatchOption;
  behaviors?: WechatMiniprogram.Behavior.BehaviorIdentifier[];
  [k: string]: any;
}>;
