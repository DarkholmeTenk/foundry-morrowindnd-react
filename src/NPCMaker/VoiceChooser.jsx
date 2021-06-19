import {useCallback, useEffect, useState} from "react";
import RefreshButton from "./RefreshButton";
import {useNpcVoiceData} from "./NPCMakerApi";

function generateVoice(data) {
    if(!data) return {}
    let voice = {}
    Object.keys(data).forEach(key=>{
        let array = data[key]
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
    let {data} = useNpcVoiceData()
    let [voice, setVoice] = useState({})
    let refresh = useCallback(()=>{
        setVoice(generateVoice(data))
    }, [data])
    useEffect(refresh, [data])
    let component = <VoiceDisplay voice={voice} refreshVoice={refresh} />
    let table = `<table><tbody>${Object.keys(voice).map(x=>`<tr><td>${x}</td><td>${voice[x]}</td></tr>`).join("")}</tbody></table>`
    return {voice: table, component}
}