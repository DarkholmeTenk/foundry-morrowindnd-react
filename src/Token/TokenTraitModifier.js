import {NPCImage} from "../NPCMaker/NPCMakerUtils";
import {getNpcNameData} from "../NPCMaker/NPCMakerApi";
import {generateName} from "../NPCMaker/NameHelper";
import LogFactory from "../Util/Logging";

const log = LogFactory("TokenTraitModifier")

let traits = {
    "dunmer": ()=>({"actorData.data.traits.dr.value": ["fire"]}),
    "nord": ()=>({"actorData.data.traits.dr.value": ["cold"]}),
    "heavy": (actor)=>({"actorData.data.attributes.ac.flat": actor.getRollData().attributes.ac.value + 2})
}

Hooks.on("createTokenMutate", async (update, {token})=>{
    update(async ()=>{
        let image = token.data.img.replace(/.*\//, "")
        let matchedTraits = Object.keys(traits).filter((traitName)=>image.indexOf(traitName) !== -1)
        log.debug("Matching traits", image, matchedTraits)
        let updateData = {}
        matchedTraits.forEach(traitName=>{
            let trait = traits[traitName](token.actor)
            Object.assign(updateData, trait)
        })
        updateData["actorData.img"] = token.data.img
        let imageObj = new NPCImage({name: image})
        let {race, gender} = imageObj.getTags()
        if(race && gender && !token.actorLink) {
            let nameData = await getNpcNameData()
            let name = generateName(nameData, race, gender)
            updateData["name"] = name
            updateData["actorData.name"] = name
        }
        log("Adding traits", matchedTraits, updateData)
        return updateData
    })
})