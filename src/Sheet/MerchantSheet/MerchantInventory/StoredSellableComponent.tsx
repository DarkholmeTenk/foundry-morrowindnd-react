import React, {createContext, useState} from "react";
import {Button, Card, CardActions, CardContent, TextField} from "@mui/material";
import SellableSourceEditor from "./Config/SellableSourceEditor";

export const SellableSourceContext = createContext<any>({})

export const StoredSellableComponentOptions = {
    width: 1400,
    height: 700
}

function Editor({source, setSource, id, setId, commit}) {
    if(!source) {
        return null
    }
    return <Card>
        <CardContent>
            <TextField value={id} onChange={(e)=>setId(e.target.value)} />
            <SellableSourceEditor source={source} setSource={setSource} />
        </CardContent>
        <CardActions>
            <Button onClick={commit}>Commit</Button>
        </CardActions>
    </Card>
}

export default function StoredSellableComponent({setting}) {
    let [store, setStore] = useState(setting.value)
    let sources = Object.keys(store).filter(Boolean).sort()
    let [editing, setEditing] = useState<string | null>(null)
    let [current, setCurrent] = useState<any | null>(null)
    let elements = sources.map((sourceId)=>(
        <div className="flex-row" key={sourceId}>
            <span>{sourceId}</span>
            <a onClick={()=>{
                setEditing(sourceId)
                setCurrent(store[sourceId])
            }}><i className="fas fa-edit"/></a>
            <a onClick={()=>{
                let newOne = {...store}
                delete newOne[sourceId]
                setStore(newOne)
            }}><i className="fas fa-trash"/></a>
        </div>
    ))
    let commit = ()=>{
        setStore({...store, [editing!]: current})
        setCurrent(null)
        setEditing("")
    }
    return (<SellableSourceContext.Provider value={store}>
        <div>
            {elements}
            <Button onClick={()=>{
                setCurrent({itemId: null})
                setEditing("")
            }}>+</Button>
            <Editor source={current} setSource={setCurrent} id={editing} setId={setEditing} commit={commit} />
            <Button onClick={()=>setting.value=store}>Save</Button>
        </div>
    </SellableSourceContext.Provider>)
}