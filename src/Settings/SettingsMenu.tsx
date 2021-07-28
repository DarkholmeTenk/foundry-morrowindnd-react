import {Setting} from "../Constants/Config";
import {RegularSetting} from "./Settings";
import {useCallback, useState} from "react";
import AlchemySettingsEditor from "../Item/Alchemy/AlchemySettingsEditor";
import {AppBar, Button, Tab, Tabs} from "@material-ui/core";

interface SettingsMenuArgs {
    setting: Setting<RegularSetting>
}
export default function SettingsMenu({setting}) {
    let [value, setValue] = useState(setting.value)
    let [tab, setTab] = useState(0)
    let save = useCallback(()=>setting.value = value, [value, setting])
    let reset = useCallback(()=>setValue(setting.value), [setValue, setting])
    let setAlchemy = useCallback((na)=>setValue({...value, alchemy: na}), [value, setValue])
    return <>
        <AppBar position="sticky" >
            <Tabs value={tab} onChange={(e,v)=>setTab(v)}>
                <Tab label="Alchemy" />
            </Tabs>
        </AppBar>
        {tab === 0 ? <AlchemySettingsEditor value={value.alchemy} setValue={setAlchemy} /> : null}
        <Button onClick={save}>Save</Button>
    </>
}