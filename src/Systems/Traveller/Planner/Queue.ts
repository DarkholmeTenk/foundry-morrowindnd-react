import {Jump} from "./Jumps";
import {JumpSorter} from "./JumpSorter";

export class Queue {
    array: Jump[] = []
    constructor(private jumpSorter: JumpSorter) {
    }

    add(jumps: Jump[]) {
        this.array.push(...jumps)
        this.array.sort(this.jumpSorter)
    }

    next(): Jump | undefined {
        if(this.array.length == 0) return undefined
        return this.array.splice(0, 1)[0]
    }
}