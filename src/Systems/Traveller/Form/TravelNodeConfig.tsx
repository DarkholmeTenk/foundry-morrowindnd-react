import {TravelData, TravelInfo} from "../Data/NoteData";
import {useFieldInOut, ObjectUpdater} from "../../../Util/React/update/ObjectUpdater";
import {FormGroup, FormLabel} from "@material-ui/core";
import {SimpleCheckbox} from "./SimpleCheckbox";
import {OtherNode} from "./TravelDataForm";
import TravelListForm from "./TravelListForm";

interface TravelNodeConfigArgs {
    data: TravelData,
    setData: ObjectUpdater<TravelData>,
    others: OtherNode[]
}
export default function TravelNodeConfig({data, setData, others}: TravelNodeConfigArgs) {
    let isDark = useFieldInOut<TravelData, boolean>("isDark")
    let isAlmsivi = useFieldInOut<TravelData, boolean>("almsivi")
    let isDivine = useFieldInOut<TravelData, boolean>("divine")
    let isDirect = useFieldInOut<TravelData, boolean>("direct")
    let isMages = useFieldInOut<TravelData, boolean>("mages")

    let boat = useFieldInOut<TravelData, TravelInfo[]>("boat")
    let silt = useFieldInOut<TravelData, TravelInfo[]>("siltstrider")
    let prop = useFieldInOut<TravelData, TravelInfo[]>("propylon")

    return <>
        <SimpleCheckbox data={data} field={isDark} updater={setData} label="Is Dark" />
        <FormGroup title="Teleportation">
            <FormLabel component="legend">Teleportation</FormLabel>
            <SimpleCheckbox data={data} field={isAlmsivi} updater={setData} label="Almsivi Intervention" />
            <SimpleCheckbox data={data} field={isDivine} updater={setData} label="Divine Intervention" />
            <SimpleCheckbox data={data} field={isDirect} updater={setData} label="Direct Teleportation" />
            <SimpleCheckbox data={data} field={isMages} updater={setData} label="Mages Guild" />
            <TravelListForm data={data} setData={setData} others={others} title="Boat Travel" field={boat} hasCosts={true}/>
            <TravelListForm data={data} setData={setData} others={others} title="Siltstrider" field={silt} hasCosts={true}/>
            <TravelListForm data={data} setData={setData} others={others} title="Propylon" field={prop} hasCosts={false}/>
        </FormGroup>
    </>
}