import {genders, races} from "./NPCMakerUtils";
import styles from "./NPCTagChooser.module.scss"

function increment(obj, part, ignore) {
    if(part == null) {
        if(!ignore)
            obj["None"] = (obj["None"] || 0) + 1
    } else {
        let newVal = obj[part] || 0
        obj[part] = newVal + 1
    }
}

function getTagCounts(files, {ignoreNoRace, ignoreNoGender}) {
    let blocks = {races: {}, genders: {}, other: {}}
    files.forEach((file)=>{
        let {race, gender, other} = file.getTags()
        increment(blocks.races, race, ignoreNoRace)
        increment(blocks.genders, gender, ignoreNoGender)
        other.forEach(part=>increment(blocks.other, part))
    })
    return blocks
}

function Selector({options, current, setCurrent}) {
    let isChecked = (f)=>{
        if(current === null) return false;
        if(typeof(current) === "object") {
            return current[f]
        } else {
            return current === f
        }
    }
    return <div>
        {Object.keys(options).sort().map((r)=><div key={r}><span>
            <input type="checkbox" checked={isChecked(r)} onChange={(e)=>setCurrent({c: r, s: e.target.checked})} />
            {r} - {options[r]}
        </span></div>)}
    </div>
}

export default function NPCTagChooser({files, filtered, choice, setChoice}) {
    let blocks = getTagCounts(filtered, choice)

    return <div>
        <span className={styles.category_holder}>
            <div className={styles.category}>
                <h3>Race</h3>
                <input type="checkbox" checked={choice.ignoreNoRace} onChange={(e)=>setChoice(choice.copy({ignoreNoRace: e.target.checked}))}/>Ignore No Race
                <Selector options={blocks.races} current={choice.race} setCurrent={({c, s})=>setChoice(choice.copy({race: s?c:null}))} />
            </div>
            <div className={styles.category}>
                <h3>Gender</h3>
                <input type="checkbox" checked={choice.ignoreNoGender} onChange={(e)=>setChoice(choice.copy({ignoreNoGender: e.target.checked}))}/>Ignore No Gender
                <Selector title="Gender" options={blocks.genders} current={choice.gender} setCurrent={({c,s})=>setChoice(choice.copy({gender: s?c:null}))} />
            </div>
            <div className={styles.category}>
                <h3>Other</h3>
                <Selector title="Other" options={blocks.other} current={choice.other} setCurrent={({c,s})=>setChoice(choice.setOther(c, s))} />
            </div>
        </span>
    </div>
}