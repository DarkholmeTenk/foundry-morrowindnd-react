import { useEffect, useState } from "react";
let nameCache;
let voiceCache;
export function getNpcNameData() {
    if (!nameCache) {
        nameCache = window.fetch("https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/NPCData.json").then(r => r.json());
    }
    return nameCache;
}
export function getNpcVoiceData() {
    if (!voiceCache) {
        voiceCache = window.fetch("https://foundry-darkcraft-bucket.s3.eu-west-2.amazonaws.com/data/VoiceData.json").then(r => r.json());
    }
    return voiceCache;
}
function load(getter) {
    let [loading, setLoading] = useState(true);
    let [data, setData] = useState(null);
    useEffect(() => {
        setLoading(true);
        getter().then((d) => {
            setLoading(false);
            setData(d);
        });
    }, []);
    return { loading, data };
}
export function useNpcNameData() {
    return load(getNpcNameData);
}
export function useNpcVoiceData() {
    return load(getNpcVoiceData);
}
