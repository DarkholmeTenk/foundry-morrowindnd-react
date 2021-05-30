export interface ActorClass {
    name: string
    subclass: string
}

export interface ActorClassData {
    map: Record<string, ActorClass>
    list: ActorClass[]
}

export function getClasses(actor: Actor<any, Item<any>>): ActorClassData {
    let list = actor.items.filter(x=>x.type === "class")
        .map(x=>({name: x.name, subclass: x.data.data.subclass}))
    let map: Record<string, ActorClass> = {}
    list.forEach(x=>map[x.name.toLowerCase()] = x)
    return {map, list}
}