import {AlchemyEffectPotion} from "Systems/Crafting/Alchemy/Model/AlchemyEffect";
import {StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {Remover, Updater, useArrayAdder, useArrayReducers} from "Util/Helper/ArrayReducers";
import {onItemDrop} from "Util/Helper/DropHelper";
import {ItemUUIDViewer} from "Util/Components/ItemViewer/ItemViewer";
import {IntField} from "Util/Components/Input/InputField";
import {Button, TwoPressButton} from "Util/Components/SimpleComponents/SimpleButton";
import {DeleteIcon} from "Util/Components/SimpleComponents/IconLibrary";

interface ItemProps {
    potion: AlchemyEffectPotion
    updater: Updater<AlchemyEffectPotion>
    remover: Remover
    index: number
}
export function AlchemyEffectPotionEditor({potion, updater, remover, index}: ItemProps) {
    let setValue = updater.forSlot(index)
    let setUuid = useMappedSetter("uuid", setValue)
    let setDc = useMappedSetter("dc", setValue)
    let dropHandler = onItemDrop((x)=>{
        if(!(x.type === "consumable")) return
        setUuid(x.uuid)
    })
    return <li onDrop={dropHandler}>
        <ItemUUIDViewer item={potion.uuid} />
        <IntField value={potion.dc} setter={setDc} label="DC" />
        <TwoPressButton onClick={()=>remover(index)} icon={DeleteIcon} />
    </li>
}

interface Props {
    potions: AlchemyEffectPotion[]
    setPotions: StateSetter<AlchemyEffectPotion[]>
}
export function AlchemyEffectPotionsEditor({potions, setPotions}: Props) {
    let [updater, adder, remover] = useArrayReducers(setPotions)
    let dropHandler = onItemDrop((x)=>{
        if(!(x.type === "consumable")) return
        adder({uuid: x.uuid, dc: 10})
    })
    return <div>
        <div onDrop={dropHandler}>
            Drop potions here
        </div>
        <ul>
            {potions.map((x, i)=><AlchemyEffectPotionEditor key={x.uuid} potion={x} index={i} updater={updater} remover={remover} />)}
        </ul>
    </div>
}