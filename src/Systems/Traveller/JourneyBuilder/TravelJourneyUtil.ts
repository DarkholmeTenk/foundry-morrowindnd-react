import {NoteData} from "Systems/Traveller/Data/NoteData";
import {getDistance, HasPosition} from "Util/Helper/DistanceHelper";

export function getClosestIntervention(type: "almsivi" | "divine", sceneData: NoteData[], from: HasPosition) {
    return sceneData.filter(x=>x.travel[type]).reduce((a,b)=>getDistance(from, a.note) < getDistance(from, b.note) ? a : b)

}