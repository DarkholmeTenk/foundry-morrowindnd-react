import {useCallback, useState} from "react";
import {Checkbox} from "@material-ui/core";

function getState(selected: {[key: string]: boolean}, user, defaultState): boolean {
    return selected[user.id] !== undefined ? selected[user.id] : defaultState
}

export function getActivePlayerUsers() {
    return game.users.filter(u=>!u.isGM && u.active)
}

export function UserCheckbox({user, checked, toggle, disabled}) {
    let toggleMe = useCallback(()=>toggle(user), [user, toggle])
    return <div>
        <Checkbox size="small" checked={checked} disabled={disabled} onClick={toggleMe} />
        {user.name} - {user.character?.name}
    </div>
}

export function UserGroupSelector({selected, setSelected, defaultState = false, disabled = false}) {
    let users = getActivePlayerUsers()
    let toggle = useCallback((user)=>setSelected(s=>({...s, [user.id]: !getState(s, user, defaultState)})), [defaultState])
    let map = users.map(u=><UserCheckbox user={u} key={u.id} checked={selected[u.id] !== undefined ? selected[u.id] : defaultState} toggle={toggle} disabled={disabled} /> )
    return <div>
        {map}
    </div>
}

export function useUserGroupSelector({defaultState = false, disabled = false}) {
    let [selected, setSelected] = useState({})
    let component = <UserGroupSelector {...{selected, setSelected, defaultState, disabled}} />
    let selectedUsers = getActivePlayerUsers().filter(u=>getState(selected, u, defaultState))
    return {component, selectedUsers}
}