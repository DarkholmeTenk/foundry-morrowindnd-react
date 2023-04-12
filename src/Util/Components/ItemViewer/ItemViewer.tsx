import React from "react"
// @ts-ignore
import styles from "./ItemViewer.module.scss"
import {ReactNodeLike} from "prop-types";
import {useDragHandler} from "Util/Helper/DropHelper";
import {useSuspensePromise} from "Util/Suspense/SuspenseContext";

export interface ItemViewerProps {
    name: string
    img: string,
    sheet?: Application
}
interface ItemViewerArgs extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    item?: ItemViewerProps | undefined | null
    children?: ReactNodeLike,
    onClick?: ()=>void
}
export default function ItemViewer({item, children, onClick, ...other}: ItemViewerArgs) {
    if(!onClick && item?.sheet) onClick = ()=>item.sheet?.render(true)
    let image = item?.img || "icons/svg/mystery-man.svg"
    let name = item?.name || "No Item"
    let dragStart = useDragHandler(item)
    return <div className={styles.viewer} onClick={onClick} {...other} onDragStart={dragStart} draggable={dragStart !== undefined}>
        <img src={image} className={styles.image} />
        <span className={styles.name}>{name}</span>
        {children}
    </div>
}

export function ItemUUIDViewer({item, ...rest}: Omit<ItemViewerArgs, "item"> & {item: UUID | undefined | null}) {
    let realItem = item ? fromUuidSync(item) as ItemViewerProps : undefined
    return <ItemViewer item={realItem} {...rest} />
}

export function ItemDataViewer({item}: {item: SmartItemData}) {
    let x = useSuspensePromise("itemload."+item.name, ()=>Item.create(item, {temporary: true}))
    return <ItemViewer item={x} />
}