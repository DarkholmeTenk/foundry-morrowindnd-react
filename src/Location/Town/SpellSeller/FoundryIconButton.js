export default function FoundryIconButton({icon, aClasses, iClasses, title, onClick}) {
    return <a className={aClasses} onClick={onClick} title={title}>
        <i className={`${icon} ${iClasses || ""}`} />
    </a>
}

export function FoundryItemControl({icon, title, onClick, toggle, active}) {
    let classes = "item-control" + (toggle ? (" item-toggle" + (active ? " active" : "")) : "")
    return <FoundryIconButton icon={icon} title={title} onClick={onClick} aClasses={classes} />
}