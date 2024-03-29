import LogFactory from "../../../Util/Logging";
import {fixItemData} from "Util/Helper/ItemTransferHelper";

const {mergeItemData} = require("../../../Util/Helper/ItemHelper.ts");

const log = LogFactory("MergeItemsButton")

Hooks.on("actorSheetMenuItems", (add, app)=>{
    let actor = app.object as Actor5e
    if(actor.isOwner) {
        add({
            name: "Merge Items",
            icon: '<i class="fas fa-sort-amount-up"></i>',
            callback: async ()=>{
                let itemData = actor.items.map(i=>i._source)
                let merged = mergeItemData(itemData)
                let mergedIds = merged.map(x=>x._id)
                let remove = itemData.filter(i=>!mergedIds.includes(i._id))
                let update = merged.filter(mergedData=>{
                    let oldItemData = itemData.find(j => mergedData._id === j._id)
                    return oldItemData && oldItemData !== mergedData
                }).map(y=>fixItemData(y, {}))
                log("Merging", itemData, remove, add)
                await actor.deleteEmbeddedDocuments("Item", remove.map(i=>i._id ?? ""))
                await actor.updateEmbeddedDocuments("Item", update)
            }
        })
    }
})