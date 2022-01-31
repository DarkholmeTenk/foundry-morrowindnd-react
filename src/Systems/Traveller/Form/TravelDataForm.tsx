import {TravelData} from "../Data/NoteData";
import {useCallback, useState} from "react";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {SButton} from "../../../Util/React/ReactHelpers";
import useStateObjectUpdater, {useFieldInOut} from "../../../Util/React/update/ObjectUpdater";
import TravelNodeConfig from "./TravelNodeConfig";
import {SimpleCheckbox} from "./SimpleCheckbox";
import {fixReciprocal} from "../Data/NoteSettingsFlag";

export interface OtherNode {
    entry: JournalEntry,
    travel: TravelData
}
interface TravelDataFormArgs {
    note: JournalEntry,
    travelData: TravelData,
    otherNodes: OtherNode[]
}
export default function TravelDataForm({note, travelData, otherNodes}: TravelDataFormArgs) {
    let [data, setData] = useState(travelData)
    let save = useCallback(async ()=>{
        await note.setFlag("traveller", "travelData", data)
        await fixReciprocal(note, data, otherNodes)
    }, [data, note])
    let updater = useStateObjectUpdater(setData)
    let isTravel = useFieldInOut<TravelData, boolean>("isTravel")
    return <div>
        <FormGroup>
            <SimpleCheckbox data={data} field={isTravel} updater={updater} label="Is Travel Node" />
            {data.isTravel ? <TravelNodeConfig data={data} setData={updater} others={otherNodes} /> : null}
        </FormGroup>
        <SButton onClick={save}>Save</SButton>
    </div>
}