import {useCallback, useState} from "react";
import {Button, Popover} from "@material-ui/core";
import {PermissionControls} from "./PermissionControls";
import {useWatchEntity} from "../../Helper/EntityHelper";

export type MyDocument = Actor | Item | JournalEntry
export function DocumentControls<T extends DocumentBase>({doc}: {doc: DocumentBase}) {
    let [isOpen, setOpen] = useState<Element | undefined>(undefined)
    useWatchEntity(doc)
    let open = useCallback((e)=>setOpen(e.target), [])
    let close = useCallback(()=>setOpen(undefined), [])

    if(!doc) return null
    return <>
        <div><Button onClick={open} size="small">Configure</Button></div>
        <Popover open={isOpen !== undefined} anchorEl={isOpen} onClose={close}>
            Controls:
            <PermissionControls document={doc} />
        </Popover>
    </>
}