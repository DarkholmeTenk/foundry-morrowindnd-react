import React from "react"
// @ts-ignore
import styles from "./ItemViewer.module.scss"
import {ReactNodeLike} from "prop-types";

/**
 * @param item {Item5e>}
 * @param children
 * @param other
 * @returns {JSX.Element}
 * @constructor
 */
interface ItemViewerArgs {
    item: Item5e | Actor5e
    children?: ReactNodeLike,
    onClick?: ()=>void
}
export default function ItemViewer({item, children, onClick, ...other}: ItemViewerArgs) {
    if(!onClick) onClick = ()=>item.sheet!.render(true)
    let image = item?.img || "icons/svg/mystery-man.svg"
    let name = item?.name || "No Item"
    return <div className={styles.viewer} onClick={onClick} {...other}>
        <img src={image} className={styles.image} />
        <span className={styles.name}>{name}</span>
        {children}
    </div>
}