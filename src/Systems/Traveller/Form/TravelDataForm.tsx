import {TravelData} from "../Data/NoteData";
import {useCallback, useState} from "react";
import {FormGroup} from "@material-ui/core";
import useStateObjectUpdater, {useFieldInOut} from "../../../Util/React/update/ObjectUpdater";
import TravelNodeConfig from "./TravelNodeConfig";
import {SimpleCheckbox} from "./SimpleCheckbox";
import {fixReciprocal} from "../Data/NoteSettingsFlag";
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";
import {TravelDataFlagKey} from "../Data/NoteDataUtil";
import {Button} from "Util/Components/SimpleComponents";

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
        await note.setFlag(FLAG_SCOPE, TravelDataFlagKey, data)
        await fixReciprocal(note, data, otherNodes)
    }, [data, note])
    let updater = useStateObjectUpdater(setData)
    let isTravel = useFieldInOut<TravelData, boolean>("isTravel")
    return <div>
        <FormGroup>
            <SimpleCheckbox data={data} field={isTravel} updater={updater} label="Is Travel Node" />
            {data.isTravel ? <TravelNodeConfig data={data} setData={updater} others={otherNodes} /> : null}
        </FormGroup>
        <Button onClick={save}>Save</Button>
    </div>
}