import {useCallback, useState} from "react";
import {Popover} from "@mui/material";
import {PermissionControls} from "./PermissionControls";
import {useWatchEntity} from "Util/Helper/EntityHelper";
import {useIsGm} from "Util/React/core/GmContext";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export type MyDocument = Actor | Item | JournalEntry
export function DocumentControls<T extends DocumentBase>({doc}: {doc: DocumentBase}) {
    let [isOpen, setOpen] = useState<Element | undefined>(undefined)
    useWatchEntity(doc)
    let open = useCallback((e)=>setOpen(e.target), [])
    let close = useCallback(()=>setOpen(undefined), [])
    let isGm = useIsGm()

    if(!doc) return null
    if(!doc.isOwner && !isGm) return null
    return <>
        <div><Button onClick={open} >Configure</Button></div>
        <Popover open={isOpen !== undefined} anchorEl={isOpen} onClose={close}>
            Controls:
            <PermissionControls document={doc} />
        </Popover>
    </>
}