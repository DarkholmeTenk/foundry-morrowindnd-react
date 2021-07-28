const {mergeItemData} = require("../Helper/ItemHelper.ts");

Hooks.on('createToken', async (scene, data)=>{
    let {_id: id, actorId, actorLink} = data
    let actor = game.actors.get(actorId)
    if(actor.owner && !actorLink) {
        let promises = []
        let update = (updateData)=>promises.push(updateData)
        Hooks.callAll("createTokenMutate", update, {scene, actor, token: data})
        let updateDataArray = (await Promise.all(promises.map(p=>p()))).filter(x=>x)
        let updateData = {}
        updateDataArray.forEach(ud=>Object.assign(updateData, ud))
        if(Object.keys(updateData).length !== 0) {
            let tokenEntity = new Token(data)
            tokenEntity.scene = scene

            if(updateData.items) {
                let items = mergeItemData(updateData.items)
                await tokenEntity.actor.createOwnedItem(items)
                delete updateData.items
            }

            await tokenEntity.update(updateData)
        }
    }
})