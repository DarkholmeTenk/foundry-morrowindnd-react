import * as React from "react";
import {JobType, JobTypeDataMap} from "./JobTypes";

export interface NPCData {
    img: string,
    name: String,
    job: JobType,
    jobData: any
}

export class NPC {
    constructor(private readonly data: NPCData) {
    }

    getJobComponent(npcUpdater: (newNPCData: NPCData)=>Promise<void>) {
        let jobTypeData = JobTypeDataMap[this.data.job]
        let object = new jobTypeData.clazz(this.data.jobData)
        let Component = jobTypeData.component
        let update = (newJobData)=>{
            let newData = {...this.data, jobData: newJobData}
            return npcUpdater(newData)
        }
        return <Component data={object} update={update}/>
    }

    toJSON() {
        return this.data
    }
}