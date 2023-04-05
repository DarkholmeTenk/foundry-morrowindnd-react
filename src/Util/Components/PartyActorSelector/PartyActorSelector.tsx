import {Avatar, Badge} from "@material-ui/core";
import {StateSetter} from "Util/React/update/Updater";
import {useArrayEnableDisable} from "Util/Helper/ArrayReducers";
import Styles from "./PartyActorSelector.module.scss";

function ActorBlob({actor, set, clear, isSet}: {actor: Actor5e, set: (a: UUID)=>void, clear: (a: UUID)=>void, isSet: boolean}) {
    if(isSet) {
        return <Badge badgeContent="X" color="primary" overlap="rectangular" onClick={()=>clear(actor.uuid)}>
            <Avatar onClick={()=>clear(actor.uuid)} src={actor.img} imgProps={{style: {border: '0px'}}} style={{ border: '0px', width: 32, height: 32 }}/>
        </Badge>
    } else {
        return <Avatar onClick={()=>set(actor.uuid)} src={actor.img} imgProps={{style: {border: '0px'}}} style={{ width: 24, height: 24 }}/>
    }
}

export function PartyActorSelector({value, setValue}: {value: UUID[], setValue: StateSetter<UUID[]>}) {
    let [enable, disable] = useArrayEnableDisable(setValue)
    let potentials = game.users.map(x=>x.character)
    return <div className={Styles.PartySelector}>
        {potentials.map((a)=> a ? <ActorBlob key={a.uuid} actor={a} set={enable} clear={disable} isSet={value.includes(a.uuid)} /> : null) }
    </div>
}