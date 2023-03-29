import React from "react";
import {ComplexSelector} from "./ComplexSelector";

function ActorDisplay({item}: {item: Opt<Actor5e>}) {
    if (item) {
        return <React.Fragment>
            <img src={item.img} style={{width: '20px', height: '20px', border: 'none'}} alt={item.name}/>
            {item.name}
        </React.Fragment>
    } else {
        return <React.Fragment>No Actor</React.Fragment>
    }
}

interface Props {
    potentialActors: Actor5e[]
    actor: Opt<Actor5e>
    setChosenActor: (newActor: Opt<Actor5e>)=>unknown
}
export function ActorChooser({potentialActors, actor, setChosenActor}: Props) {
    return <ComplexSelector text={<ActorDisplay item={actor}/>} values={potentialActors} setValue={setChosenActor} displayComponent={ActorDisplay} nameFunction={x=>x?.name ?? "No Actor"} />
}