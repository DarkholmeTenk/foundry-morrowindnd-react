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
    data?: X
}

let cache: {[id: string]: Promise<any>} = {}

function load<X>(id, url) {
    let [loading, setLoading] = useState(true)
    let [data, setData] = useState(null)
    useEffect(()=>{
        setLoading(true)
        if(!cache[id]) {
            cache[id] = window.fetch(url).then(r=>r.json())
        }
        cache[id].then((d)=>{
            setLoading(false)
            setData(d as X)
        })
    },  [])
    return {loading, data}
}

export function useNpcNameData(): Loading<NameData> {
    return load("NpcNameData", "https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/NPCData.json")
}

interface VoiceData {
    speed: string[],
    pitch: string[],
    texture: string[],
    patterns: string[],
    mannerisms: string[]
}

export function useNpcVoiceData(): Loading<VoiceData> {
    return load("NpcVoiceData", "https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/VoiceData.json")
}