import {useMoneyRequest} from "Systems/GroupPay/useMoneyRequest";
import {RequestMoneyIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import React from "react";

interface Props {
    amount: number
    purpose: string
}
export function RequestMoneyButton({amount, purpose}: Props) {
    let {canRequestMoney, requestMoney} = useMoneyRequest()
    if(!canRequestMoney) return null
    return <ItemControl title="Request money from party" icon={RequestMoneyIcon} onClick={()=>requestMoney(amount, purpose)} />
}