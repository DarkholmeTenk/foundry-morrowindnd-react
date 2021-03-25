import {Updatable} from "../../Util/State/Updatable";

export class TaskData {
    actors: string[]
    dc: number
    advantage: boolean
    disadvantage: boolean
}

export enum TaskTypes {
    navigation = "navigation",
    foraging = "foraging",
    lookout = "lookout"
}

const defaultTaskState: ()=>TaskState = ()=>new TaskState({actors: [], dc: 10, advantage: false, disadvantage: false})

export type AllTasks = {[type in TaskTypes]: TaskState}

export const defaultTasks: ()=>AllTasks = ()=>( {
    navigation: defaultTaskState(),
    foraging: defaultTaskState(),
    lookout: defaultTaskState()
})

interface TaskInfo {
    label: string,
    stat: {
        label: string,
        value: string
    }
}

export const TaskInfos: {[type in TaskTypes]: TaskInfo} = {
    navigation: {
        label: "Navigation",
        stat: {
            label: "Survival (Wis)",
            value: "sur"
        }
    },
    foraging: {
        label: "Foraging",
        stat: {
            label: "Nature (Int)",
            value: "nat"
        }
    },
    lookout: {
        label: "Lookout",
        stat: {
            label: "Perception (Wis)",
            value: "per"
        }
    }
}

// @ts-ignore
export class TaskState implements TaskData {
    constructor(readonly data: TaskData) {
        Object.assign(this, data)
    }

    @Updatable
    setAdvantage(advantage: boolean, disadvantage: boolean): TaskState {
        return new TaskState({
            ...this.data,
            advantage,
            disadvantage
        })
    }

    @Updatable
    setDC(dc: number): TaskState  {
        return new TaskState({
            ...this.data,
            dc
        })
    }

    static fromJSON(data: TaskData) {
        return new TaskState(data)
    }

    toJSON() {
        return this.data
    }
}