function DesireTooltipThing({desirer}) {
    let actor = game.actors.get(desirer)
    if(!actor) return null
    return <div>
        <img style={{width: "20px", height: "20px"}} src={actor.img} />
        {actor.name}
    </div>
}

export default function DesireTooltip({desirers, desireInfo}) {
    let subs = desirers.map(d=><DesireTooltipThing key={d} desirer={d} />)
    return <div>
        {desireInfo.name}
        {subs}
    </div>
}