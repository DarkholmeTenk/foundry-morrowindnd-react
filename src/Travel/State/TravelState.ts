import {defaultTasks, AllTasks, TaskData, TaskTypes, TaskInfos} from "./TaskData";
import {requestRolls, RollResult} from "../../Util/RollHelper";
import {StateUpdate} from "../../Util/StateManager";

export interface TravelStateData {
    tasks: AllTasks,
    rolled: boolean,
    distance: number,
    totalDistance: number,
    rolls?: RollResult[]
}

export const defaultTravelStateData: TravelStateData = {
    tasks: defaultTasks,
    rolled: false,
    distance: 0,
    totalDistance: 100
}

export interface SetActorTask {
    task: TaskTypes | null
    actor: string
}

export interface SetTask {
    task: TaskTypes,
    data: Partial<TaskData>
}

export default class TravelState {
    constructor(readonly data: TravelStateData = defaultTravelStateData) {
    }

    // @ts-ignore
    @StateUpdate()
    public setActorTask({actor, task}: SetActorTask): TravelState {
        let newTasks:AllTasks = {...this.data.tasks}
        Object.values(TaskTypes).forEach(type=>{
            let result = newTasks[type].actors.filter(id=>id !== actor)
            newTasks[type] = {...newTasks[type], actors: result}
        })
        if(task) {
            newTasks[task].actors = [...newTasks[task].actors, actor]
        }
        let newData = {...this.data, tasks: newTasks, rolls: null}
        return new TravelState(newData)
    }

    public setTask({data, task}: SetTask): TravelState {
        let newTasks:AllTasks = {...this.data.tasks}
        newTasks[task] = {...newTasks[task], ...data}
        let newData = {...this.data, tasks: newTasks, rolls: null}
        return new TravelState(newData)
    }

    public async roll(ff: boolean): Promise<TravelState> {
        let rollRequests = Object.values(TaskTypes).flatMap((type)=>{
            let taskInfo = TaskInfos[type]
            let task = this.data.tasks[type]
            let skill = taskInfo.stat.value
            return task.actors.map(actor=>({
                actor,
                skill,
                options: {
                    advantage: task.advantage,
                    disadvantage: task.disadvantage,
                    fastForward: ff
                }
            }))
        })
        let rolls = await requestRolls(rollRequests, {})
        return new TravelState({...this.data, rolls})
    }
}