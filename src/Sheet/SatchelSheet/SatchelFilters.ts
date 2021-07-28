interface SatchelFilter {
    label: string,
    filter: (i: Item<any>)=>boolean
}

export const SatchelFilters: SatchelFilter[] = [
    {
        label: "Any",
        filter: (item)=>true
    },
    {
        label: "Scroll",
        filter: (item)=>item.type === "consumable" && item.data.data.consumableType === " scroll"
    }
]