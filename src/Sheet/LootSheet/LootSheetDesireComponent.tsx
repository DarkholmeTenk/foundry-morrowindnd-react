import {Desire, MappedDesires} from "./LootFlags";
import {Chip, CircularProgress, Tooltip} from "@material-ui/core";
import {useCallback} from "react";
import {MarkLootDesire} from "./LootAction";
import {e} from "../../Util/Helper/DomEventHelper";
import DesireTooltip from "./Desire/DesireTooltip";
import {useNewSelf} from "../../Util/React/core/NewSelfSelector";

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
    selfId: UUID,
    item: Item
}
function DesireButton({desires, desire, selfId, item}: DesireButtonArgs) {
    let desireInfo = DESIRE_INFOS[desire]
    let filtered = [...desires.keys()].filter(x=>desires.get(x) === desire)
    let text = desireInfo.text
    let isChecked = desires.get(selfId) === desire
    let onClick = useCallback(e(async ()=>{
        MarkLootDesire({selfId, lootId: item.uuid, desire})
    }), [selfId, item, desire])
    let onDelete = useCallback(e(async ()=>{
        MarkLootDesire({selfId, lootId: item.uuid, desire: null})
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
    desires: MappedDesires
}
export default function LootSheetDesireComponent({item, desires}: LootSheetDesireComponentArgs) {
    let selfId = useNewSelf()?.uuid
    if(!selfId) return null
    let xd = desires.get(item.id!) || new Map<string, Desire>()
    let users = game.users!.filter(x=>x.active && !x.isGM)
    let progress = Math.max(1, users.length > 0 ? 100 * xd.size / users.length : 1)
    let desireButtons = Object.keys(DESIRE_INFOS).map(desire=><DesireButton key={desire} desires={xd} desire={desire as any as Desire} selfId={selfId!} item={item}/>)
    return <div>
        {desireButtons}
        <CircularProgress variant="determinate" size={18} value={progress} />
    </div>
}