import {useCallback} from "react";
import {e} from "../Helper/DomEventHelper"

const states = [
    {name: "None", icon: <i className="fas fa-times-circle"/>},
    {name: "Limited", icon: <i className="fas fa-question-circle"/>},
    {name: "Vision", icon: <i className="fas fa-eye"/>},
    {name: "Full", icon: <i className="fas fa-check-circle"/>}
]

function getState(user, state) {
    return (state[user] === undefined || state[user] === null) ? state.default : state[user]
}

function PermissionStateButton({user, state, setState}) {
    let myState = getState(user.id, state) || 0
    let stateData = states[myState]
    let onClick = useCallback(e((e)=>{
        setState(user.id, (myState + 1) % states.length)
    }), [user, myState, setState])
    let onContext = useCallback(e(()=>{
        setState(user.id, null)
    }), [user, setState])
    return <a onClick={onClick} onContextMenu={onContext} title={stateData.name}>
        {stateData.icon}
        {user.name}
        {user.character ? `[${user.character?.name}]` : null }
    </a>
}

export default function TokenPermission({token}) {
    let users = game.users.contents.filter(x=>x !== game.user)
    let state = token.data.permission || {}
    let updateUser = useCallback(async (userId, permission)=>{
        if(permission == null) {
            let x = {...token.data.permission}
            delete x[userId]
            await token.update({"permission": x}, {recursive: false, diff: false, noHook: true})
        } else {
            await token.update({[`permission.${userId}`]: permission})
        }
    }, [token])
    return <div className="flex-col">
        <PermissionStateButton user={{id: 'default', name: "Default"}} state={state} setState={updateUser} />
        {users.map(user=><PermissionStateButton user={user} state={state} setState={updateUser} key={user.id} /> )}
    </div>
}