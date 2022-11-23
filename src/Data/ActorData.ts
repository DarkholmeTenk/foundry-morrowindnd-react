export interface ActorClass {
    name: string
    subclass: string
}

export interface ActorClassData {
    map: Record<string, ActorClass>
    list: ActorClass[]
}

export function getClasses(actor: Actor): ActorClassData {
    let list = Object.values(actor.classes).map(x=>({name: x.name!, subclass: x.system.subclass}))
    let map: Record<string, ActorClass> = {}
    list.forEach(x=>map[x.name.toLowerCase()] = x)
    return {map, list}
}