import {GroupPayRequester} from "Systems/GroupPay/Model/GroupPayRequest";
import {openReactApplication} from "Util/React/openReactApplication";
import {RequestUIComponent} from "Systems/GroupPay/RequestUI/RequestUIComponent";

export function openRequestUI(requester: GroupPayRequester) {
    openReactApplication(<RequestUIComponent requester={requester} />, {width: 500, height: 250})
}