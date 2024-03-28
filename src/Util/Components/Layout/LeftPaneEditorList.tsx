import {useArrayAdder, useArrayRemover} from "Util/Helper/ArrayReducers";
import {Button, TwoPressButton} from "Util/Components/SimpleComponents/SimpleButton";
import {DeleteIcon, EditIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {StateSetter} from "Util/React/update/Updater";
import {mapSort, StringSorter} from "Util/Sorting";
import {LeftPaneList} from "Util/Components/Layout/Panes";
import Styles from "./Panes.module.scss"

export function LeftPaneImageDecorator<T extends {image: string | undefined}>({value: {image}}: {value: T}) {
    return image ? <img src={image} style={{height: "16px"}} alt="" /> : null
}

interface LeftPaneEditorListProps<T> {
    list: T[],
    set: StateSetter<T[]>
    editing: string | undefined,
    setEditing: StateSetter<string | undefined>
    addNew: () => T,
    decorator?: (t: {value: T})=>JSX.Element | null
}

const NameSorter = mapSort<{ name: string }, string>(x => x.name, StringSorter)
interface Listable {name: string, id: string}
export function LeftPaneEditorList<T extends Listable>({ list, set, editing, setEditing, addNew, decorator}: LeftPaneEditorListProps<T>) {
    let D = decorator
    let adder = useArrayAdder(set)
    let remover = useArrayRemover(set)
    return <>
        <LeftPaneList>
            {list.map((x, i) => <li key={x.id}>
                <span className={x.id === editing ? Styles.Active : undefined}>
                    {D ? <D value={x} /> : null}
                    {x.name}
                </span>
                <span>
                    <Button onClick={() => setEditing(x.id)} icon={EditIcon}/>
                    <TwoPressButton onClick={() => remover(i)} icon={DeleteIcon}/>
                </span>
            </li>)}
        </LeftPaneList>
        <Button onClick={() => adder(addNew())}>Add New</Button>
    </>
}