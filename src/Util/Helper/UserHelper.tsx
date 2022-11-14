import {useCallback, useState} from "react";
import {ReactNodeLike} from "prop-types";
import {AvatarChip} from "../React/core/NewSelfSelector";

function getState(selected: {[key: string]: boolean}, user, defaultState): boolean {
    return selected[user.id] !== undefined ? selected[user.id] : defaultState
}

export function getActivePlayerUsers() {
    return game.users!.filter(u=>!u.isGM)
}

export function UserCheckbox({user, checked, setMe, disabled}: {user: User, checked: boolean, setMe: (user: User, v: boolean)=>void, disabled: boolean}) {
    let mySet = useCallback((v: boolean)=>setMe(user, v), [user, setMe])
    return <AvatarChip actor={user.character!} selected={checked} setSelected={mySet} short />
}

export function UserGroupSelector({selected, setSelected, defaultState = false, disabled = false}) {
    let users = getActivePlayerUsers()
    let setMe = useCallback((user: User, v: boolean)=>setSelected(s=>{
        let newValue = {...s, [user.id!]: v}
        return newValue
    }), [setSelected])
    let map = users.map(u=><UserCheckbox user={u} key={u.id} checked={selected[u.id!] ?? defaultState} setMe={setMe} disabled={disabled} /> )
    return <div className="flex-row">
        {map}
    </div>
}

export function useUserGroupSelector({defaultState = false, disabled = false}): {component: ReactNodeLike, selectedUsers: User[]} {
    let [selected, setSelected] = useState({})
    let component = <UserGroupSelector {...{selected, setSelected, defaultState, disabled}} />
    let selectedUsers = getActivePlayerUsers().filter(u=>getState(selected, u, defaultState))
    return {component, selectedUsers}
}