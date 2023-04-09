import {useEffect, useState} from "react";

interface NameData {
    "name": string,
    "firstName": string,
    "lastName": string,
    "race": string,
    "gender": string,
    "className": string
}

interface Loading<X> {
    loading: boolean,
    data: X | null
}

let nameCache: Promise<NameData> | undefined
let voiceCache: Promise<VoiceData> | undefined

export function getNpcNameData(): Promise<NameData> {
    if(!nameCache) {
        nameCache = window.fetch("https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/NPCData.json").then(r=>r.json())
    }
    return nameCache
}

export function getNpcVoiceData(): Promise<VoiceData> {
    if(!voiceCache) {
        voiceCache = window.fetch("https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/VoiceData.json").then(r=>r.json())
    }
    return voiceCache
}

function load<T>(getter: ()=>Promise<T>): Loading<T> {
    let [loading, setLoading] = useState(true)
    let [data, setData] = useState<T | null>(null)
    useEffect(()=>{
        setLoading(true)
        getter().then((d)=>{
            setLoading(false)
            setData(d)
        })
    },  [])
    return {loading, data}
}

export function useNpcNameData(): Loading<NameData> {
    return load(getNpcNameData)
}

interface VoiceData {
    speed: string[],
    pitch: string[],
    texture: string[],
    patterns: string[],
    mannerisms: string[]
}

export function useNpcVoiceData(): Loading<VoiceData> {
    return load(getNpcVoiceData)
}