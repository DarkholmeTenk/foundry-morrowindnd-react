import {useCallback, useEffect, useState} from "react";

export function useGameItem(item) {
    let constructor = item.constructor.name
    let [itemState, setItemState] = useState(item)

    let update =  useCallback((newItem)=> {
        setItemState(newItem)
    }, [item])

    useEffect(()=>{
        Hooks.on(`update${constructor}`, update)
        return ()=>Hooks.off(`update${constructor}`, update)
    }, [item])

    return itemState
}

export function SButton({children, onClick, ...args}) {
    let onClickWrap = (e)=>{
        e.preventDefault()
        if(onClick) onClick(e)
    }
    return <button {...args} onClick={onClickWrap}>{children}</button>
}