import {StateSetter} from "Util/React/update/Updater";
import {AlchemyEffectImage} from "Systems/Crafting/Alchemy/Model/AlchemyEffect";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {DeleteIcon, TakeIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {useArrayAdder, useArrayRemover} from "Util/Helper/ArrayReducers";
import Styles from "./Input.module.scss"
import {mapSort, StringSorter} from "Util/Sorting";

function OptionalImage({image, label}: {label: string, image: string | undefined}) {
    if(!image) return null
    return <img src={image} alt={label} />
}

const NameSort = mapSort<Selectable, string>(x=>x.name, StringSorter)
interface Selectable {
    id: string
    name: string
}
type X = Selectable | (Selectable & {image?: string | undefined})
interface Props<T> {
    potential: T[],
    selected: string[],
    setSelected: StateSetter<string[]>
}
export function SplitTypeSelector<T extends X>({potential, selected, setSelected}: Props<T>) {
    let adder = useArrayAdder(setSelected)
    let remover = useArrayRemover(setSelected)
    return <div className={Styles.SplitTaker}>
        <div>
            <h3>Added</h3>
            {selected.map((e, i)=>{
                let eff = potential.find(y=>y.id === e)
                if(!eff) return null
                return <span key={eff.id} className={Styles.Row}>
                    <span>
                        <OptionalImage image={"image" in eff ? eff.image : undefined} label={eff.name} />
                        {eff.name}
                    </span>
                    <Button onClick={()=>remover(i)} icon={DeleteIcon} />
                </span>
            })}
        </div>
        <div>
            <h3>Available</h3>
            {potential.filter(e=>!selected.some(x=>x === e.id)).sort(NameSort).map((e)=>{
                return <span key={e.id} className={Styles.Row}>
                    <span>
                        <OptionalImage image={"image" in e ? e.image : undefined} label={e.name} />
                        {e.name}
                    </span>
                    <Button onClick={()=>adder(e.id)} icon={TakeIcon} />
                </span>
            })}
        </div>
    </div>
}