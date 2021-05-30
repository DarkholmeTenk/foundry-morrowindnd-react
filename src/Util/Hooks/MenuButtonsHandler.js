import styles from "./MenuButtonsHandler.module.scss"

function upper(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function registerMenuButtonsHandler(names) {
    names.forEach(name=>{
        Hooks.on(`render${upper(name)}`, function(_,html) {
            let menuItems = []
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
                        btn.click(e=>mi.callback(e))
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
