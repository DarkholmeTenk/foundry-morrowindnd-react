import {SimplePos} from "../Canvas/SimpleParts";
import {NoteData, TravelInfo} from "../Data/NoteData";
import {getDistance} from "../../../Util/Helper/DistanceHelper";
import {getTeleportDestinations} from "../Data/NoteDataUtil";
import {TravelSortData} from "./JumpSorter";

const MIN_DIST = 100

export function currentNote(location: SimplePos, noteData: NoteData[]): NoteData | undefined {
    return noteData.find(data=>getDistance(location, data.note.data) <= MIN_DIST)
}

function fixNum(num: number | undefined | null): number {
    if(num) {
        if(isNaN(num) || !isFinite(num)) return 0
        return num
    }
    return 0
}

export interface Jump extends TravelSortData {
    from: NoteData | undefined,
    to: NoteData,
    desc: string,
}
function getTravelJumps(current: NoteData, others: NoteData[]): Jump[] {
    let jumps: Jump[] = []
    let types = ["siltstrider", "boat", "propylon"]
    types.forEach(type=> {
        let travel = current?.travel ?? {}
        let destinations = (travel[type] ?? []) as TravelInfo[]
        destinations.forEach(destination=>{
            let note = others.find(({entry})=>entry.id === destination.target)
            if(note) {
                jumps.push({
                    from: current,
                    to: note,
                    desc: type,
                    distance: getDistance(current.note.data, note.note.data),
                    time: fixNum(destination.hours),
                    cost: fixNum(destination.cost ?? 0)
                })
            }
        })
    })
    return jumps
}
function getTPJumps(location: SimplePos, current: NoteData | undefined, noteData: NoteData[]): Jump[] {
    let jumps: Jump[] = []
    if(current && current.travel.mages) {
        noteData.filter(x=>x != current && x.travel.mages).forEach(note=> {
            jumps.push({
                from: current,
                to: note,
                desc: "mages",
                distance: getDistance(current.note.data, note.note.data),
                time: 0,
                cost: 80
            })
        })
    }
    let closenessMap = getTeleportDestinations(location, noteData)
    Object.keys(closenessMap).forEach(type=>{
        closenessMap[type].forEach(note=>{
            jumps.push({
                from: current,
                to: note,
                desc: type,
                distance: getDistance(current?.note?.data ??location, note.note.data),
                time: 0,
                cost: 0
            })
        })
    })
    return jumps
}
export function getJumps(location: SimplePos, current: NoteData | undefined, noteData: NoteData[]): Jump[] {
    let rCurrent = current ?? currentNote(location, noteData)
    let jumps: Jump[] = []
    if(rCurrent) {
        jumps.push(...getTravelJumps(rCurrent, noteData))
    }
    jumps.push(...getTPJumps(location, rCurrent, noteData))
    return jumps
}