import React from "react"
// @ts-ignore
import styles from "./ItemViewer.module.scss"
import {ReactNodeLike} from "prop-types";

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
    return <div className={styles.viewer} onClick={onClick} {...other}>
        <img src={image} className={styles.image} />
        <span className={styles.name}>{name}</span>
        {children}
    </div>
}