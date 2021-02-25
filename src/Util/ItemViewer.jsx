import styles from "./ItemViewer.module.scss"

/**
 * @param item {Item}
 * @param children
 * @param other
 * @returns {JSX.Element}
 * @constructor
 */
export default function ItemViewer({item, children, onClick, ...other}) {
    if(!onClick) onClick = ()=>item.sheet.render(true)
    let image = item?.img || "icons/svg/mystery-man.svg"
    let name = item?.name || "No Item"
    return <div className={styles.viewer} onClick={onClick} {...other}>
        <img src={image} className={styles.image} />
        <span className={styles.name}>{name}</span>
        {children}
    </div>
}