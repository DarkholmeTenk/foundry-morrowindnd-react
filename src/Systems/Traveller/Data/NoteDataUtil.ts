import {NoteData, TravelData} from "./NoteData";
import {p2pRoutes, teleportation} from "../const";
import {getDistance} from "../../../Util/Helper/DistanceHelper";
import {SimplePos} from "../Canvas/SimpleParts";
import {clone} from "../../../Util";

export function getTravelData(note): TravelData | undefined {
    if(!note) return undefined
    let x: any | null | undefined
    if(note.flags) {
        x = note.flags.traveller?.travelData
    } else {
        x = note.getFlag("traveller", "travelData")
    }
    if(x) {
        x = clone(x)
        p2pRoutes.forEach(({id})=>{
            (x[id] ?? []).forEach(n=>{
                n.cost = parseFloat(n.cost)
                n.hours = parseFloat(n.hours)
            })
        })
    }
    return x
}

export function getSceneNoteData(scene: Scene): NoteData[] {
    return scene.notes.map(note=>{
        let entry = note.entry!
        let travel = getTravelData(entry)
        if(!travel || !travel.isTravel) return null
        return {note, entry, travel}
    }).filter((x)=>x).map(x=>x!)
}

type NoteDataTeleportDestinations = Record<string, NoteData[]>
export function getTeleportDestinations(location: SimplePos | undefined, notes: NoteData[]): NoteDataTeleportDestinations {
    let map: NoteDataTeleportDestinations = {}
    teleportation.map(({id, proximity})=>{
        let tpNodes = notes.filter(({travel}) => travel[id])
        if(proximity) {
            let closest: NoteData[] = []
            if(location && tpNodes.length > 0) {
                let closestNode = tpNodes
                    .map(d => ({d, dist: getDistance(d.note, location)}))
                    .reduce((p, c) => c.dist < p.dist ? c : p)
                closest = [closestNode.d]
            }
            map[id] = closest
        } else {
            map[id] = tpNodes
        }
    })
    return map
}