import {GroupPayRequest} from "../Model/GroupPayRequest";
import {GroupPayRequesterView} from "./GroupPayRequesterView";
import GoldDisplay from "../../../Util/Components/GoldDisplay";
import Styles from "./GroupPaySheet.module.scss"

export function GroupPayRequestView({request}: {request: GroupPayRequest}) {
    return <div className={Styles.RequestView}>
        <div className={Styles.RequestView_Top}>
            <div>
                <h3>Requester</h3>
                <GroupPayRequesterView requester={request.requester} />
            </div>
            <div>
                <h3>Is Requesting</h3>
                <GoldDisplay value={request.amount} />
            </div>

        </div>
        <div>
            <h3>For:</h3>
            <span>{request.purpose}</span>
        </div>
    </div>
}