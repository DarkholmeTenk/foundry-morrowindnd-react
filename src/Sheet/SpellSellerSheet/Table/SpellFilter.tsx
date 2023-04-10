import {ItemTableFilter} from "Util/Components/NewItemTable/NewItemTableFilters";
import {
    generateFilterFunction,
    ItemFilterState,
    ItemTableFilterComp
} from "Util/Components/NewItemTable/Item/Filter/StandardItemFilter";
import {StateSetter} from "Util/React/update/Updater";
import Styles from "./SpellTable.module.scss"

type SpellFilterState = ItemFilterState & {
    minLevel: number,
    maxLevel: number
}
export const SpellFilter: ItemTableFilter<ItemSpell, SpellFilterState> = {
    defaultState: {minLevel: 1, maxLevel: 9},
    FilterComponent: Component,
    generateFilter: generateSpellFilterFunction
}

interface ItemTableFilterArgs {
    items: ItemSpell[],
    state: SpellFilterState
    setState: StateSetter<SpellFilterState | undefined>
}
function Component({items, state, setState}: ItemTableFilterArgs) {
    return <div className={Styles.Filter}>
        <div className={Styles.OldBlock}>
            <ItemTableFilterComp items={items} state={state} setState={setState} />
        </div>
        <div className={Styles.LevelBlock}>
            <span>Level</span>
            <div className={Styles.Row}>
                <input title="Min" type={"number"} value={state.minLevel ?? 1} min={0} max={state.maxLevel} onChange={e=>setState({...state, minLevel: e.target.valueAsNumber ?? 1})} />
                <input title="Max" type={"number"} value={state.maxLevel ?? 9} min={state.minLevel} max={9} onChange={e=>setState({...state, maxLevel: e.target.valueAsNumber ?? 1})} />
            </div>
        </div>
    </div>
}

type FilterFunction = (item: ItemSpell) => boolean
function generateSpellFilterFunction(filter: SpellFilterState): FilterFunction {
    let oFilter = generateFilterFunction(filter)
    let {minLevel = 1, maxLevel = 9} = filter
    return (a)=>{
        if(!oFilter(a)) return false
        return a.system.level >= minLevel && a.system.level <= maxLevel
    }
}
