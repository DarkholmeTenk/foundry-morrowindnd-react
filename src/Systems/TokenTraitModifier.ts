import {NPCImage} from "Systems/NPCMaker/NPCMakerUtils";
import {getNpcNameData} from "Systems/NPCMaker/NPCMakerApi";
import {generateName} from "Systems/NPCMaker/NameHelper";
import LogFactory from "Util/Logging";
import {CreateTokenMutateArgs} from "Util/Hooks/TokenMutateHooks";

const log = LogFactory("TokenTraitModifier")

let traits = {
    "dunmer": ()=>({"actorData.data.traits.dr.value": ["fire"]}),
    "nord": ()=>({"actorData.data.traits.dr.value": ["cold"]}),
    "heavy": (actor)=>({"actorData.data.attributes.ac.flat": actor.getRollData().attributes.ac.value + 2})
}

Hooks.on("createTokenMutate", async (update, {token}: CreateTokenMutateArgs)=>{
    update(async ()=>{
        let imgSrc = token.texture?.src
        let image = imgSrc?.replace(/.*\//, "") ?? ""
        let matchedTraits = Object.keys(traits).filter((traitName)=>image.indexOf(traitName) !== -1)
        log.debug("Matching traits", image, matchedTraits)
        let updateData = {}
        matchedTraits.forEach(traitName=>{
            let trait = traits[traitName](token.actor)
            Object.assign(updateData, trait)
        })
        if(imgSrc) updateData["actorData.img"] = imgSrc
        let imageObj = new NPCImage({name: image})
        let {race, gender} = imageObj.getTags()
        if(race && gender && !token.isLinked) {
            let nameData = await getNpcNameData()
            let name = generateName(nameData, race, gender)
            updateData["name"] = name
            updateData["actorData.name"] = name
        }
        log("Adding traits", matchedTraits, updateData)
        return updateData
    })
})