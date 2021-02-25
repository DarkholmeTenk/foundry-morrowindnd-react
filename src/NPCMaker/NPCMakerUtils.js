import {generateName} from "./NameHelper";

export const genders = ["male", "female"]
export const races = ["altmer", "argonian", "bosmer", "breton", "dunmer", "imperial", "khajiit", "nord", "orc", "redguard"]

export function isIn(value, array) {
    return array.some((v)=>v.toLowerCase() === value.toLowerCase())
}

export class NPCImage {
    constructor(image) {
        this.image = image;
        this.path = image.path
        this.name = image.name;
    }

    getTags(backup = {}) {
        let name = this.name
        let race = backup.race || null
        let gender = backup.gender || null
        let other = []
        let split = name.substring(0, name.indexOf(".")).split("_")
        split.forEach((part,index)=>{
            if(!isNaN(part)) return
            if(isIn(part, genders)) gender = part.toLowerCase()
            else if(isIn(part, races)) race = part.toLowerCase()
            else other.push(part.toLowerCase())
        })
        return {race, gender, other}
    }

    getRandomName(choices) {
        let {race, gender} = this.getTags(choices)
        return generateName(race, gender)
    }
}

function matchProperty(value, choice, ignore = true) {
    if(value == null) {
        if(ignore) {
            return false
        } else {
            return choice == null || choice == "None"
        }
    } else if(choice == null) {
        return true
    } else {
        return value === choice
    }
}

export class NPCChoices {
    constructor({race= null, gender= null, other= [], ignoreNoGender= false, ignoreNoRace = false} = {}) {
        this.data = {race, gender, other, ignoreNoGender, ignoreNoRace}
        Object.assign(this, this.data)
    }

    match(image) {
        let {race, gender, other} = image.getTags()
        let {race: oRace, gender: oGender, other: oOther, ignoreNoRace, ignoreNoGender} = this.data
        return matchProperty(race, oRace, ignoreNoRace) && matchProperty(gender, oGender, ignoreNoGender) && oOther.every(oValue=>other.some(value=>value === oValue))
    }

    filter(images) {
        return images.filter(x=>this.match(x))
    }

    setOther(key, value) {
        if(value) {
            if(!this.data.other.some(x=>x === key)) {
                return this.copy({other: [...this.data.other, key]})
            } else {
                return this;
            }
        } else {
            return this.copy({other: this.data.other.filter(x=>x !== key)})
        }
    }

    copy(newValues) {
        return new NPCChoices({...this.data, ...newValues})
    }
}