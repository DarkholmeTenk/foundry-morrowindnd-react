import ItemViewer from "Util/Components/ItemViewer/ItemViewer";
import {useContext, useState} from "react";
import {parseGold} from "Util/Helper/GoldHelper";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import Styles from "./RequestUI.module.scss"
import {createGroupPayMessage} from "Systems/GroupPay/Message/CreateGroupPayMessage";
import ApplicationContext from "Util/React/core/ApplicationContext";
import {GroupPayRequester} from "Systems/GroupPay/Model/GroupPayRequest";
import {GroupPayRequesterView} from "Systems/GroupPay/Sheet/GroupPayRequesterView";

export function RequestUIComponent({requester}: {requester: GroupPayRequester}) {
    let [amount, setAmount] = useState("0")
    let [purpose, setPurpose] = useState("")
    let {close} = useContext(ApplicationContext)
    let goldAmount = parseGold(amount)
    let valid = goldAmount > 0 && purpose.trim() !== ""
    let makeRequest = async ()=>{
        if(!valid) return
        await createGroupPayMessage({requester, amount: goldAmount, purpose})
        await close()
    }
    return <div>
        <div className={Styles.Header}>
            <div>
                <h3>Requester</h3>
                <GroupPayRequesterView requester={requester} />
            </div>
            <div className="flex-col">
                <h3>Amount</h3>
                <input value={amount} onChange={(e)=>setAmount(e.target.value)}/>
                <GoldDisplay value={goldAmount} />
            </div>
        </div>
        <div>
            <h3>Purpose</h3>
            <input value={purpose} onChange={(e)=>setPurpose(e.target.value)}/>
        </div>
        <div>
            <Button onClick={makeRequest} disabled={!valid}>Make Request</Button>
        </div>
    </div>
}