// @ts-ignore
import { getFlag } from "../Util/FlagHelper";
export const ITEM_FLAG = "extra_properties";
export function getProperties(item) {
    return getFlag(item, ITEM_FLAG, {});
}
