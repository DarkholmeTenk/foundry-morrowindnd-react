import {SimpleReactApplication} from "Util/React/ReactApplication";
import {hasGroupPayFlag} from "../Model/GroupPayFlag";
import {GroupPaySheet} from "./GroupPaySheet";

export function openGroupPay(messageId: string) {
    let message = game.messages.get(messageId)
    if(message && hasGroupPayFlag(message)) {
        new SimpleReactApplication(<GroupPaySheet message={message} />, {width: 600, height: 400}).render(true)
    }
}