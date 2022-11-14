import Document from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import {useCallback, useState} from "react";
import {Button, Popover} from "@material-ui/core";
import {PermissionControls} from "./PermissionControls";
import {useSmartEntity} from "../../Helper/EntityHelper";

export type MyDocument = Actor | Item | JournalEntry
export function DocumentControls<T extends Document<any>>({document}: {document?: MyDocument}) {
    let [isOpen, setOpen] = useState<Element | undefined>(undefined)
    let {value: doc} = useSmartEntity(document ?? null)
    if(!doc) return null
    let open = useCallback((e)=>setOpen(e.target), [])
    let close = useCallback(()=>setOpen(undefined), [])
    return <>
        <div><Button onClick={open} size="small">Configure</Button></div>
        <Popover open={isOpen !== undefined} anchorEl={isOpen} onClose={close}>
            Controls:
            <PermissionControls document={doc} />
        </Popover>
    </>
}