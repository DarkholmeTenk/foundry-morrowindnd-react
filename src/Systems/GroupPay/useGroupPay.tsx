import {useGlobalData} from "../../Util/Helper/useGlobalData";

export function useGroupPay() {
    let data = useGlobalData("group_pay", {toPay: [], paid: []})
}