import {SimplePos} from "../Canvas/SimpleParts";
import {NoteData} from "../Data/NoteData";
import {currentNote, getJumps, Jump} from "./Jumps";
import {Queue} from "./Queue";
import {JumpSorter, TravelSortData} from "./JumpSorter";

type DijkstraMap = Record<string, DijkstraData>
export interface DijkstraData extends TravelSortData {
    note: NoteData | undefined,
    jumps: Jump[]
}

function getEntryId(noteData: NoteData | undefined) {
    return noteData?.note?.id ?? ""
}
function addInitial(map: DijkstraMap, location: SimplePos, notes: NoteData[]) {
    let start = currentNote(location, notes)
    map[getEntryId(start)] = {
        note: start,
        jumps: [],
        distance: 0,
        cost: 0,
        time: 0
    }
}

export function calculateDijkstra(location: SimplePos, noteData: NoteData[], sort: JumpSorter): DijkstraMap {
    let queue = new Queue(sort)
    let map: DijkstraMap = {}

    addInitial(map, location, noteData)
    queue.add(getJumps(location, undefined, noteData))
    let next: Jump | undefined;
    while(next = queue.next()) {
        let from = map[getEntryId(next.from)]
        let nextId = getEntryId(next.to)
        let nextData = map[nextId]
        let newData = {
            distance: from.distance + next.distance,
            time: from.time + next.time,
            cost: from.cost + next.cost
        }
        if(nextData) {
            if(sort(newData, nextData) < 0) {
                map[nextId] = {
                    note: next.to,
                    jumps: [...from.jumps, next],
                    ...newData
                }
                queue.add(getJumps(next.to.note.data, next.to, noteData))
            }
        } else {
            map[nextId] = {
                note: next.to,
                jumps: [...from.jumps, next],
                ...newData
            }
            queue.add(getJumps(next.to.note.data, next.to, noteData))
        }
    }
    return map
}