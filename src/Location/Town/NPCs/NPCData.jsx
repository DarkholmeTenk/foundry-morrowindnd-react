import * as React from "react";
import { JobTypeDataMap } from "./JobTypes";
export class NPC {
    constructor(data) {
        this.data = data;
    }
    getJobComponent(npcUpdater) {
        let jobTypeData = JobTypeDataMap[this.data.job];
        let object = new jobTypeData.clazz(this.data.jobData);
        let Component = jobTypeData.component;
        let update = (newJobData) => {
            let newData = { ...this.data, jobData: newJobData };
            return npcUpdater(newData);
        };
        return <Component data={object} update={update}/>;
    }
    toJSON() {
        return this.data;
    }
}
