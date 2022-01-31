import {TravelData, TravelInfo} from "../Data/NoteData";
import {FormGroup, FormLabel} from "@material-ui/core";
import {InOut, ObjectUpdater, useFieldInOut, useObjectUpdater} from "../../../Util/React/update/ObjectUpdater";
import {OtherNode} from "./TravelDataForm";
import Selector from "../../../Util/Components/Selector";
import {useCallback, useMemo} from "react";
import {ArrayUpdater, useArrayField} from "../../../Util/React/update/ArrayUpdater";
import {NumberInOut, SimpleInput} from "./SimpleInput";
import {SButton} from "../../../Util/React/ReactHelpers";

interface OtherData {
    ids: string[],
    nameMap: Record<string, string>,
    nodes: OtherNode[]
}

interface TravelRowArgs {
    data: TravelInfo,
    index: number,
    updater: ArrayUpdater<TravelInfo>
    others: OtherData,
    hasCosts: boolean
}
function TravelRow({data, index, updater, others: {ids, nameMap}, hasCosts}: TravelRowArgs) {
    let rowUpdater = useMemo(()=>updater.index(index), [index, updater])
    let fieldUpdater = useObjectUpdater(rowUpdater)
    let setTarget = useCallback((target)=>fieldUpdater.setField({target}), [fieldUpdater])
    let cost = useFieldInOut<TravelInfo, number>("cost")
    let time = useFieldInOut<TravelInfo, number>("hours")
    return <div style={{display: "flex", flexDirection: "row"}}>
        <Selector value={data.target} values={ids} labelFunction={x=>nameMap[x]} label="Target" setValue={setTarget} />
        {hasCosts ? <>
                <SimpleInput label="Time in hours" data={data} updater={fieldUpdater} field={time} converter={NumberInOut} />
                <SimpleInput label="Cost" data={data} updater={fieldUpdater} field={cost} converter={NumberInOut} />
            </> : null}
        <SButton onClick={rowUpdater.delete} style={{width: "24px", height: "24px"}}>X</SButton>
    </div>
}

interface TravelListFormArgs{
    data: TravelData,
    setData: ObjectUpdater<TravelData>,
    field: InOut<TravelData, TravelInfo[]>
    title: string,
    others: OtherNode[],
    hasCosts: boolean
}
export default function TravelListForm({data, setData, field, title, others, hasCosts}: TravelListFormArgs) {
    let val = field.in(data) || []
    let updater = useArrayField(setData, field)

    let otherData = useMemo(()=>{
        let ids: string[] = []
        let nameMap: Record<string, string> = {}
        others.forEach(x=>{
            ids.push(x.entry.id || "noid")
            nameMap[x.entry.id || "noid"] = x.entry.name || "No name"
        })
        return {ids, nameMap, nodes: others}
    }, others)
    let add = useCallback(()=>updater.add({target: "", cost: NaN, hours: NaN}), [updater])

    let children = val.map((info, index)=><TravelRow data={info} index={index} updater={updater} others={otherData} hasCosts={hasCosts} />)
    return <FormGroup>
        <FormLabel component="legend">{title}</FormLabel>
        <SButton onClick={add} style={{width: "24px", height: "24px"}}>+</SButton>
        {children}
    </FormGroup>
}