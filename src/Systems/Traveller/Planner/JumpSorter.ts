import {Jump} from "./Jumps";

export interface TravelSortData {
    distance: number,
    time: number,
    cost: number
}
export type JumpSorter = (a: TravelSortData, b: TravelSortData)=>number

function buildSorter(j: (jump: TravelSortData)=>number) {
    return (a,b)=>{
        let aV = j(a)
        let bV = j(b)
        return aV - bV
    }
}
const cost: JumpSorter = buildSorter(j=>j.cost)
const time: JumpSorter = buildSorter(j=>j.time)

interface JumpSorterType {
    name: string,
    sorter: JumpSorter
}
export const CostSorter: JumpSorterType = {
    name: "Cost",
    sorter: combine([cost, time])
}
export const TimeSorter: JumpSorterType = {
    name: "Time",
    sorter: combine([time, cost])
}

function combine(sorters: JumpSorter[]): JumpSorter {
    return (a,b)=> {
        for (let s of sorters) {
            let v = s(a, b)
            if(v != 0) return v
        }
        return 0
    }
}