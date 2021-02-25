import VoiceData from "./VoiceData.json"
import {useCallback, useState} from "react";
import RefreshButton from "../Util/RefreshButton";

function generateVoice() {
    let voice = {}
    Object.keys(VoiceData).forEach(key=>{
        let array = VoiceData[key]
        let choice = Math.floor(Math.random() * array.length)
        voice[key] = array[choice]
    })
    return voice
}

function VoiceDisplay({voice, refreshVoice}) {
    return <div>
        <table><tbody>{Object.keys(voice).map(x=><tr key={x}><td>{x}</td><td>{voice[x]}</td></tr>)}</tbody></table>
        <RefreshButton onClick={refreshVoice} />
    </div>
}

export function useVoice() {
    let [voice, setVoice] = useState(generateVoice())
    let refresh = useCallback(()=>{
        setVoice(generateVoice())
    })
    let component = <VoiceDisplay voice={voice} refreshVoice={refresh} />
    let table = `<table><tbody>${Object.keys(voice).map(x=>`<tr><td>${x}</td><td>${voice[x]}</td></tr>`).join("")}</tbody></table>`
    return {voice: table, component}
}