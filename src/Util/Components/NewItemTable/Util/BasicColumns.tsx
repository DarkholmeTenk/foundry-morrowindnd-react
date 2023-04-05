import {getterColumn} from "./GetterColumn";

export const BasicImageColumn = getterColumn("", (img: string | undefined) => img ? <img width="24px" height="24px" src={img}/> : null)