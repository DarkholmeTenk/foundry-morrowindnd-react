import getLogger from "../Util/LoggerFactory";
import {NPCImage} from "../NPCMaker/NPCMakerUtils";
import {getNpcNameData} from "../NPCMaker/NPCMakerApi";
import {generateName} from "../NPCMaker/NameHelper";

const log = getLogger("TokenTraitModifier")

let traits = {
    "dunmer": ()=>({"actorData.data.traits.dr.value": ["fire"]}),
    "nord": ()=>({"actorData.data.traits.dr.value": ["cold"]}),
    "heavy": (actor)=>({"actorData.data.attributes.ac.value": actor.data.data.attributes.ac.value + 2})
}

Hooks.on("createTokenMutate", async (update, {token, actor})=>{
    update(async ()=>{
        let image = token.img.replace(/.*\//, "")
        let matchedTraits = Object.keys(traits).filter((traitName)=>image.indexOf(traitName) !== -1)
        log.debug("Matching traits", image, matchedTraits)
        let updateData = {}
        matchedTraits.forEach(traitName=>{
            let trait = traits[traitName](actor)
            Object.assign(updateData, trait)
        })
        updateData["actorData.img"] = token.img
        let imageObj = new NPCImage({name: image})
        let {race, gender} = imageObj.getTags()
        if(race && gender && !token.actorLink) {
            let nameData = await getNpcNameData()
            let name = generateName(nameData, race, gender)
            updateData["name"] = name
        }
        log("Adding traits", matchedTraits, updateData)
        return updateData
    })
})