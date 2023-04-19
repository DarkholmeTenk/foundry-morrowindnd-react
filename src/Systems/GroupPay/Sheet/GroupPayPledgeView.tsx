import {getTotalPledged, GroupPayFlag, GroupPayPledge} from "../Model/GroupPayFlag";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {TableColumn} from "Util/Components/NewItemTable/TableColumn";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import {mappedColumns} from "Util/Components/NewItemTable/Util/MapColumns";
import {ActorItemTableColumns} from "Util/Components/NewItemTable/Item/ActorItemTableColumns";
import {loadActor} from "Util/Identifiers/UuidHelper";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {ResolveGroupPayAction} from "../socket/ResolveGroupPayAction";
import {ItemControl} from "Util/Components/NewItemTable/Item/ItemControls";
import {PledgeGroupPayAction} from "../socket/PledgeGroupPayAction";
import { Button } from "Util/Components/SimpleComponents/SimpleButton";

interface ED {
    amount: number
    message: ChatMessage,
    paid: boolean
}
function GroupPayResolveView({amount, message, items, paid}: ED & {items: ColData[]}) {
    if(paid) return null
    let pledged = getTotalPledged(items)
    return <div>
        {pledged === amount ? <Button onClick={()=>ResolveGroupPayAction({chatMessageId: message.id})}>Resolve</Button> : null}
    </div>
}

type ColData = GroupPayPledge & {actor: Actor5e}
const Columns: TableColumn<{}, ColData>[] = [
    ...mappedColumns((x: ColData)=>x.actor, ActorItemTableColumns),
    getterColumn("Pledged", (x: ColData)=><GoldDisplay value={x.amount} />),
    {label: "", ColumnComponent: Actions}
]

function Actions({item, message, paid}: ED & {item: ColData}) {
    if(!item.actor.isOwner) return null
    if(paid) return null
    return <>
        <ItemControl icon="fa-solid fa-xmark" title="Remove pledge" onClick={()=>PledgeGroupPayAction({chatMessageId: message.id, amount: -item.amount, selfId: item.actorId})} />
    </>
}

export function GroupPayPledgeView({amount, message, pledges, paid}: Pick<GroupPayFlag,"pledges"> & {amount: number, message: ChatMessage, paid: boolean}) {
    if(pledges.length == 0) return <div>No money pledged :'(</div>
    let mapped: ColData[] = pledges.map(x=>({
        ...x,
        actor: loadActor.sync(x.actorId) as Actor5e
    })).filter(x=>x.actor)
    return <div>
        <NewItemTable extraData={{message, amount, paid}} columns={Columns} items={mapped} actions={GroupPayResolveView}/>
    </div>
}