import {useCanvasScene} from "Util/Helper/EntityHelper";
import {getRegionFlag, RegionType} from "Systems/Explorer/Regions/SceneRegionFlag";
import {useSavableFlag} from "Util/Helper/useSavableData";
import {Button, TwoPressButton} from "Util/Components/SimpleComponents/SimpleButton";
import Styles from "./RegionEditor.module.scss"
import {useState} from "react";
import {useArrayAdder, useArrayRemover} from "Util/Helper/ArrayReducers";
import {StateSetter, useMappedSetter} from "Util/React/update/Updater";
import {chainSort, Comparator, mapSort, StringSorter} from "Util/Sorting";
import {DeleteIcon, EditIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";
import {RegionEditorFormWrap} from "Systems/Explorer/Regions/Editor/RegionEditorForm";
import {ActiveRegion, ActiveRegionChooser, useActiveRegion} from "Systems/Explorer/Regions/ActiveRegion";
import {LeftPane, MainPane, PaneView} from "Util/Components/Layout/Panes";
import {LeftPaneEditorList} from "Util/Components/Layout/LeftPaneEditorList";

let typeSorter: Comparator<RegionType> = chainSort(
    mapSort(x=>x.name, StringSorter),
    mapSort(x=>x.id, StringSorter)
)

interface ListProps {
    regions: RegionType[],
    setter: StateSetter<RegionType[]>
    setEditing: (x: string)=>void
}
function RegionEditorList({regions, setter, setEditing}: ListProps) {
    let list = regions.sort(typeSorter)
    let remove = useArrayRemover(setter)
    return <ul>
        {list.map((x,i)=><li key={x.id}>
            <span>{x.name}</span>
            <span>
                <Button onClick={()=>setEditing(x.id)} icon={EditIcon} />
                <TwoPressButton onClick={()=>remove(i)} icon={DeleteIcon} />
            </span>
        </li>)}
    </ul>
}

function newRegion(): RegionType {
    return {
        id: randomID(),
        name: "New Region",
        parentId: undefined,
        color: 0xFF00FF,
        ingredients: []
    }
}

export function RegionEditorComponent() {
    let scene = useCanvasScene()!
    let [store, setStore, save, canSave] = useSavableFlag(getRegionFlag(scene))
    let [editing, setEditing] = useState<string | undefined>()
    let listSetter = useMappedSetter("regionTypes", setStore)
    return <PaneView>
        <LeftPane>
            <ActiveRegionChooser regions={store.regionTypes} />
            <LeftPaneEditorList list={store.regionTypes} set={listSetter} editing={editing} setEditing={setEditing} addNew={newRegion} />
            <Button onClick={save} disabled={!canSave}>Save</Button>
        </LeftPane>
        <MainPane>
            <SuspenseLayer>
                {editing ? <RegionEditorFormWrap regions={store.regionTypes} setter={listSetter} editing={editing} clear={()=>setEditing(undefined)} /> : null }
            </SuspenseLayer>
        </MainPane>
    </PaneView>
}