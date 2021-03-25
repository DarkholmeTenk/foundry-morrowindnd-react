import {TaskTypes} from "./TaskData";

export enum TravelSpeed {
    slow = "slow",
    medium = "medium",
    fast = "fast"
}

interface SpeedInfo {
    tasks: Partial<Record<TaskTypes, TaskSpeedInfo>>
}

interface TaskSpeedInfo {
    advantage?: boolean,
    disadvantage?: boolean
}

export const SpeedInfos: Record<TravelSpeed, SpeedInfo> = {
    [TravelSpeed.slow]: {
        tasks: {
            navigation: {
                advantage: true
            },
            foraging: {
                advantage: true
            }
        }
    },
    [TravelSpeed.medium]: {
        tasks: {

        }
    },
    [TravelSpeed.fast]: {
        tasks: {

        }
    }
}