import {Desire, MappedDesires} from "./LootFlags";
import {Chip, Tooltip} from "@material-ui/core";
import {ActorId, getActorId, RawActorId} from "../../Util/Identifiers/ActorID";
import {getItemId, OwnedItemId} from "../../Util/Identifiers/ItemID";
import {useCallback} from "react";
import {MarkLootDesire} from "./LootAction";
import {e} from "../../Util/Helper/DomEventHelper";
import DesireTooltip from "./Desire/DesireTooltip";

let DESIRE_INFOS: {[key in Desire]: {text: string, name:  string}} = {
    [Desire.NEED]: {
        text: "N",
        name: "Need"
    },
    [Desire.GREED]: {
        text: "G",
        name: "Greed",
    },
    [Desire.SELL]: {
        text: "S",
        name: "Sell"
    }
}

interface DesireButtonArgs {
    desires: Map<string, Desire>,
    desire: Desire,
    selfId: RawActorId,
    item: Item
}
function DesireButton({desires, desire, selfId, item}: DesireButtonArgs) {
    let desireInfo = DESIRE_INFOS[desire]
    let filtered = [...desires.keys()].filter(x=>desires.get(x) === desire)
    let text = desireInfo.text
    let isChecked = desires.get(selfId.actorId) === desire
    let onClick = useCallback(e(async ()=>{
        MarkLootDesire({selfId, lootId: getItemId(item) as OwnedItemId, desire})
    }), [selfId, item, desire])
    let onDelete = useCallback(e(async ()=>{
        MarkLootDesire({selfId, lootId: getItemId(item) as OwnedItemId, desire: null})
    }), [selfId, item, desire])
    return <Tooltip title={<DesireTooltip desireInfo={desireInfo} desirers={filtered}/> } >
        <Chip
            color={isChecked ? "primary" : (filtered.length > 0 ? "secondary" : undefined)}
            size="small"
            label={text}
            clickable
            onClick={onClick}
            onDelete={isChecked ? onDelete: undefined}
            deleteIcon={isChecked ? <i className="fas fa-check" /> : undefined}
        />
    </Tooltip>
}

interface LootSheetDesireComponentArgs {
    item: Item
    selfId: RawActorId,
    desires: MappedDesires
}
export default function LootSheetDesireComponent({item, selfId, desires}: LootSheetDesireComponentArgs) {
    let xd = desires.get(item.id) || new Map<string, Desire>()
    let desireButtons = Object.keys(DESIRE_INFOS).map(desire=><DesireButton desires={xd} desire={desire as any as Desire} selfId={selfId} item={item}/>)
    return <div>
        {desireButtons}
    </div>
}