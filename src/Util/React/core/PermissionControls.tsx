import {useIsGm} from "./GmContext";
import {MyDocument} from "./DocumentControls";
import {ReactNode, useCallback} from "react";
import {IconButton} from "@material-ui/core";

const DefaultUser = {id: "default", name: "Default"}
interface PermType { name: string, icon: ReactNode }
enum PermActive {
    NO,
    DEFAULT,
    YES
}
const PermissionStates: PermType[] = [
    {name: "None", icon: <i className="fas fa-times-circle"/>},
    {name: "Limited", icon: <i className="fas fa-question-circle"/>},
    {name: "Vision", icon: <i className="fas fa-eye"/>},
    {name: "Full", icon: <i className="fas fa-check-circle"/>}
]

type PermValue = 0 | 1 | 2 | 3 | undefined
type PermState = Record<string, PermValue>

function PermissionControlButton({active, permissionKey, permissionData, setUserPermissionType}: {active: PermActive, permissionData: PermType, permissionKey: PermValue, setUserPermissionType: (v: PermValue)=>void}) {
    let setMe = useCallback(()=>setUserPermissionType(permissionKey), [permissionKey, setUserPermissionType])
    let color: "primary" | "secondary" | undefined = undefined
    if(active == PermActive.DEFAULT) color = "secondary"
    if(active == PermActive.YES) color = "primary"
    return <div><IconButton onClick={setMe} color={color}>
        {permissionData.icon}
    </IconButton></div>
}

interface UserInfo {
    id: string | null,
    name: string | null
}
function PermissionControlRow({user, state, setState}: {user: UserInfo, state: PermState, setState: (user: string, value: PermValue)=>void}) {
    let defaultValue = state[DefaultUser.id]
    let myValue = state[user.id!]
    let setMe = useCallback((value: PermValue)=>setState(user.id!, value), [setState, user])
    return <div style={{display: "flex"}}>
        <div style={{width: "100px"}}>{user.name}</div>
        {PermissionStates.map((value, index)=>{
            let active: PermActive = PermActive.NO
            if(myValue === undefined && defaultValue === index) active = PermActive.DEFAULT
            if(myValue === index) { active = PermActive.YES }
            return <PermissionControlButton active={active} permissionData={value} permissionKey={index as PermValue} setUserPermissionType={setMe} />
        })}
    </div>
}

export function PermissionControls<T extends Document>({document}: {document: MyDocument}) {
    let isGm = useIsGm()
    if(!isGm) return null
    let perms = document.data.permission
    let users = game.users?.contents?.filter(x=>x !== game.user) ?? []
    let updatePerms = useCallback(async (user: string, state: PermValue)=>{
        await document.update({[`permission.${user}`]: state})
    }, [])
    return <div>
        <PermissionControlRow user={DefaultUser} state={perms} setState={updatePerms} />
        {users.map((user)=><PermissionControlRow user={user} state={perms} setState={updatePerms} />)}
    </div>
}