import {StateSetter} from "Util/React/update/Updater";
import React, {ReactNode, useMemo, useState} from "react";

interface FilterComponentArgs<T, Q> {
    items: T[],
    state: Q,
    setState: StateSetter<Q | undefined>
}
type FilterComponent<T, Q> = React.FC<FilterComponentArgs<T, Q>>

export interface ItemTableFilter<T, Q> {
    defaultState: Q,
    FilterComponent: FilterComponent<T, Q>,
    generateFilter: (state: Q) => ((item:T) => boolean)
}

interface UseFilterProps<T, Q> {
    items: T[],
    filter?: ItemTableFilter<T, Q>
}
interface UseFilterResult<T> {
    filtered: T[],
    FilterComponent: ReactNode | null
}
export function useFilter<T, Q>({items, filter}: UseFilterProps<T, Q>): UseFilterResult<T> {
    let [filterState, setFilterState] = useState<Q | undefined>()
    let filterFun = useMemo(()=>{
        if(filter)
            return filter.generateFilter(filterState ?? filter.defaultState)
        else
            return ()=>true
    }, [filter, filterState])
    let isFilter = filter !== undefined
    let filtered = useMemo(()=>{
        if(!isFilter) return items
        return items.filter(filterFun)
    }, [items, isFilter, filterFun])
    
    if(!filter) {
        return {
            filtered,
            FilterComponent: null
        }
    } else {
        let { FilterComponent } = filter
        return {
            filtered,
            FilterComponent: <FilterComponent items={items} state={filterState ?? filter.defaultState} setState={setFilterState} />
        }
    }
}