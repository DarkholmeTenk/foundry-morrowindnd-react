import {mergeItemData} from "../Helper/ItemHelper";
import {addItem} from "../Helper/ItemTransferHelper";

function split(updates) {
    let actor = {}
    let token = {}
    Object.keys(updates).forEach(update=>{
        if(update.startsWith("actorData.")) {
            actor[update.substring(10)] = updates[update]
        } else {
            token[update] = updates[update]
        }
    })
    return {
        actor, token
    }
}

type Updater = ()=>PromiseLike<any>

export interface CreateTokenMutateArgs {
    token: TokenDocument
}
Hooks.on('createToken', async (token: TokenDocument, data)=>{
    if(token.isOwner && !token.isLinked) {
        let promises: Updater[] = []
        let update = (updateData)=>promises.push(updateData)
        Hooks.callAll("createTokenMutate", update, {token})
        setTimeout(async ()=>{
            let updateDataArray = (await Promise.all(promises.map(p=>p()))).filter(x=>x)
            let updateData: any = {}
            updateDataArray.forEach(ud=>Object.assign(updateData, ud))
            if(Object.keys(updateData).length !== 0) {

                if(updateData.items && updateData.items.length > 0) {
                    let items = mergeItemData(updateData.items)
                    await addItem(token.actor, items)
                    delete updateData.items
                }
                let splitData = split(updateData)
                if(Object.keys(splitData.actor).length > 0) {
                    await token.actor.update(splitData.actor)
                }
                if(Object.keys(splitData.token).length > 0) {
                    await token.update(splitData.token)
                }
            }
        }, 250)
    }
})