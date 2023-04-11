import styles from "./MenuButtonsHandler.module.scss"

interface ItemData {
    name: string
    icon: string,
    callback: ()=>void
}

function registerMenuButtonsHandler(names) {
    names.forEach(name=>{
        Hooks.on(`render${name.capitalize()}`, function(_, html) {
            let menuItems: ItemData[] = []
            function addMenuItem(itemData) {
                menuItems.push(itemData)
            }
            Hooks.callAll(`${name}MenuItems`, addMenuItem, ...arguments)
            if(menuItems.length > 0) {
                let expanded = menuItems.length < 3
                menuItems.forEach(mi=>{
                    let clz = mi.name.replace(" ", "-").toLowerCase();
                    let dotClz = "." + clz
                    clz += expanded ? "" : ` ${styles.shrunk}`
                    let btn = $(`<a class="${clz}" title="${mi.name}">${mi.icon}<div class="${styles.text}">${mi.name}</div></a>`)
                    if(mi.callback) {
                        btn.click(e=>mi.callback())
                    }
                    html.closest('.app').find(dotClz).remove();
                    let titleElement = html.closest('.app').find('.window-title');
                    btn.insertAfter(titleElement);
                })
            }
        })
    })
}

registerMenuButtonsHandler(["itemSheet", "rollTableConfig", "actorSheet", "scene", "journalSheet"])
