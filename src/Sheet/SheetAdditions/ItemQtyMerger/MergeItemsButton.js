import LogFactory from "../../../Util/Logging";

const {mergeItemData} = require("../../../Util/Helper/ItemHelper.ts");

const log = LogFactory("MergeItemsButton")

Hooks.on("actorSheetMenuItems", (add, app)=>{
    let actor = app.object
    if(actor.isOwner) {
        add({
            name: "Merge Items",
            icon: '<i class="fas fa-sort-amount-up"></i>',
            callback: async ()=>{
                let itemData = actor.items.map(i=>i.data)
                let merged = mergeItemData(itemData)
                let remove = itemData.filter(i=>!merged.includes(i))
                let add = merged.filter(i=>!itemData.includes(i))
                log("Merging", itemData, remove, add)
                await actor.deleteEmbeddedDocuments("Item", remove.map(i=>i._id))
                await actor.createEmbeddedDocuments("Item", add)
            }
        })
    }
})