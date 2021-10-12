interface SatchelFilter {
    label: string,
    filter: (i: Item5e)=>boolean
}

export const SatchelFilters: SatchelFilter[] = [
    {
        label: "Any",
        filter: (item)=>true
    },
    {
        label: "Scroll",
        filter: (item)=>item.type === "consumable" && item.consumable().consumableType === "scroll"
    }
]