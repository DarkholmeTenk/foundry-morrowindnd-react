import {useCallback, useEffect, useState} from "react";
import RefreshButton from "./RefreshButton";
import Selector from "../Util/Components/Selector/Selector";
import {genders, races} from "./NPCMakerUtils";

const raceMap = {
    "dark elf": "dunmer",
    "wood elf": "bosmer",
    "high elf": "altmer"
}

function map(map, choice) {
    let tlc = choice.toLowerCase()
    return map[tlc] || tlc
}

function filter(data, race, gender) {
    let nr = map(raceMap, data.race)
    let ng = data.gender.toLowerCase()
    return (race == null || race === nr) && (gender == null || gender === ng)
}

function random(things) {
    let index = Math.floor(Math.random() * things.length)
    return things[index]
}

export function generateName(data, race, gender) {
    if(data == null) return ""
    let parts = data.filter((i)=>filter(i, race, gender))
    let firstName = random(parts).firstName
    let lastName = random(parts).lastName
    return `${firstName} ${lastName}`
}

export function useName(data, image, choice) {
    let {race: imageRace, gender: imageGender} = image ? image.getTags(choice) : {}
    let [name, setName] = useState(()=>"")
    let [race, setRace] = useState("dunmer")
    let [gender, setGender] = useState(null)
    let dependants = [data, imageRace, imageGender, race, gender]
    let refreshName = useCallback(()=>{
        let raceToUse = imageRace || race
        let genderToUse = imageGender || gender
        setName(generateName(data, raceToUse, genderToUse))
    }, dependants)
    useEffect(refreshName, dependants)
    let component = <div>
        {name}
        {imageRace == null ? <Selector values={races} value={race} setValue={setRace} /> : null }
        {imageGender == null ? <Selector values={genders} value={gender} setValue={setGender} /> : null }
        <RefreshButton onClick={refreshName} />
    </div>
    return {name, component}
}