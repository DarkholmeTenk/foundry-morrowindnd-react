import {AllTasks, defaultTasks, TaskData, TaskInfos, TaskState, TaskTypes} from "./TaskData";
import {processRollResponse, requestRolls, RollResponse, RollResult} from "../../Util/RollHelper";
import {StateUpdate} from "../../Util/State/StateManager";
import {UpdatableProvider} from "../../Util/State/Updatable";
import {rehydrate} from "../../Util/State/Rehydrator";
import {TravelSpeed} from "./TravelSpeed";

export interface TravelStateData {
    tasks: AllTasks,
    rolled: boolean,
    distance: number,
    totalDistance: number,
    speed: TravelSpeed,
    rolls?: RollResponse[]
}

export const defaultTravelStateData: ()=>TravelStateData = ()=>({
    tasks: defaultTasks(),
    rolled: false,
    distance: 0,
    speed: TravelSpeed.medium,
    totalDistance: 100
})

export interface SetActorTask {
    task: TaskTypes | null
    actor: string
}

export interface SetTask {
    task: TaskTypes,
    data: Partial<TaskData>
}

const StateDecorator = StateUpdate("TravelState")

const UpdProvider = UpdatableProvider((ts: TravelState, nv: TravelStateData)=>ts.update(nv))

export default class TravelState {
    readonly rollResult: RollResult | undefined

    // @ts-ignore
    @UpdProvider.Setter
    speed: TravelSpeed

    constructor(readonly data: TravelStateData = defaultTravelStateData()) {
        this.rollResult = data.rolls ? processRollResponse(data.rolls) : undefined
    }

    @StateDecorator
    update(newData): TravelState {
        return new TravelState(newData)
    }

    @StateDecorator
    public reset(): TravelState {
        return new TravelState(defaultTravelStateData())
    }

    @StateDecorator
    public setActorTask(actor: string, task: TaskTypes | null): TravelState {
        let newTasks:any = {...this.data.tasks}
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

    @StateDecorator
    public setTask(task: TaskTypes, data: Partial<TaskData>): TravelState {
        let newTasks:AllTasks = {...this.data.tasks}
        newTasks[task] = new TaskState({...newTasks[task].data, ...data})
        let newData = {...this.data, tasks: newTasks, rolls: null}
        return new TravelState(newData)
    }

    @UpdProvider.ObjectField("tasks")
    public getTask(task: TaskTypes): TaskState {
        return this.data.tasks[task]
    }

    @StateDecorator
    public async roll(ff: boolean): Promise<TravelState> {
        let rollRequests = Object.values(TaskTypes).flatMap((type)=>{
            let taskInfo = TaskInfos[type]
            let task = this.data.tasks[type]
            let skill = taskInfo.stat.value
            return task.data.actors.map(actor=>({
                actor,
                skill,
                options: {
                    advantage: task.data.advantage,
                    disadvantage: task.data.disadvantage,
                    fastForward: ff
                }
            }))
        })
        let rolls = await requestRolls(rollRequests, {})
        return new TravelState({...this.data, rolls})
    }

    static fromJSON(data):TravelState {
        let newData = {
            ...data,
            tasks: rehydrate(data.tasks, TaskState)
        }
        return new TravelState(newData)
    }

    toJSON() {
        return this.data
    }
}