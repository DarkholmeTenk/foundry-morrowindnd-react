import {mappedColumn} from "../Util/MapColumns";
import {BasicImageColumn} from "../Util/BasicColumns";
import {getterColumn} from "../Util/GetterColumn";

export const ActorImageColumn = mappedColumn((item: Actor5e)=>item.img, BasicImageColumn)
export const ActorNameColumn = getterColumn<Actor5e>("Name", (item)=>item.name)

export const ActorItemTableColumns = [
    ActorImageColumn,
    ActorNameColumn
]
