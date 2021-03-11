export class TaskData {
    actors: string[]
    dc: number
    advantage: boolean
    disadvantage: boolean
}

export enum TaskTypes {
    navigation = "navigation",
    foraging = "foraging"
}

const defaultTaskState: TaskData = {actors: [], dc: 10, advantage: false, disadvantage: false}

export type AllTasks = {[type in TaskTypes]: TaskData}

export const defaultTasks: AllTasks = {
    navigation: defaultTaskState,
    foraging: defaultTaskState
}

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
    }
}