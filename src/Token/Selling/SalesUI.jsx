import "@darkholme/foundry-react-core/src/Util/AsyncHelper"
import {useCallback, useContext, useState} from "react";
import {CircularProgress, Slider} from "@material-ui/core"
import {onDrop} from "@darkholme/foundry-react-core/src/Util/DropHelper";
import Styles from "./SalesUI.module.scss"
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";

function add(prev, newOne) {
    if(prev.some(x=>x.item.id === newOne.id))
        return prev
    else
        return [...prev, {item: newOne, qty: newOne.data.data.quantity}]
}

function getValue({item, qty, rate}) {
    return item.data.data.price * qty * rate
}

function getMaxQty(item) {
    return item.data.data.quantity
}

function ItemDisplay({data: {item, qty}, update, rate}) {
    let maxQty = getMaxQty(item)
    let value = getValue({item, qty, rate})
    let realValue = getValue({item, qty, rate:1})
    return <div className={Styles.itemContainer}>
        <div className={Styles.itemRow} >
            <img className={Styles.itemImage} src={item.img} />
            <div style={{flexGrow: 1}}> {item.name} </div>
            <div><i className="fas fa-coins" />{value} [{realValue}]</div>
        </div>
        <div className={Styles.itemRow}>
            <Slider value={qty} max={maxQty} min={0} valueLabelDisplay="auto" onChange={(_,v)=>update({item, qty: v || 0})} />
            <div style={{minWidth: "100px", textAlign: "right"}}>{qty} / {getMaxQty(item)}</div>
        </div>
    </div>
}

function FlagUpdater({flag, setFlag, save}) {
    return <div className={Styles.settingsContainer}>
        Sales Rate
        <Slider value={flag.rate} min={0} max={1} step={0.05} valueLabelDisplay="auto" onChange={(_,v)=>setFlag({...flag, rate: v})} />
        <button onClick={save}>Save</button>
    </div>
}

let currencies = [{name: "pp", m: 10}, {name: "gp", m: 1}, {name: "sp", m: 0.1}, {name: "cp", m: 0.01}]
function buildGoldUpdate(amount, actor) {
    let update = {}
    let remaining = amount
    currencies.forEach(({name, m})=>{
        let c = Math.floor(remaining / m)
        remaining -= c * m
        if(c !== 0) {
            let value = actor.data.data.currency[name]
            update[`data.currency.${name}`] = value + c
        }
    })
    return update
}

export default function SalesUI({flag, setFlag, self}) {
    let app = useContext(AppContext)
    let [processing, setProcessing] = useState(false)
    let [flagCopy, setFlagCopy] = useState({...flag})
    let rate = flagCopy.rate || 0.1
    let [items, setItems] = useState([])

    let dropHandler = useCallback(onDrop((item)=>{
        if(item.isOwned && item.actor.id === self.id) {
            setItems((prev)=>add(prev, item))
        }
    }), [setItems])

    let totalValue = items.map(({item,qty})=>getValue({rate, item, qty})).reduce((a,b)=>a+b,0)
    let totalRealValue = items.map(({item,qty})=>getValue({rate: 1, item, qty})).reduce((a,b)=>a+b,0)
    if(processing) return <CircularProgress />

        return <div className={Styles.container} onDrop={dropHandler}>
        {game.user.isGM ? <FlagUpdater flag={flagCopy} setFlag={setFlagCopy} save={()=>setFlag(flagCopy)} /> : null }
        {items.length === 0 ? <div className={Styles.dropzone}>
            Drop Items Here
        </div> : null}
        {items.map((data,i)=>{
            let update = (newData)=>setItems(prev=>{
                    let newArr = [...prev]
                    newArr[i] = newData
                    return newArr
                })
            return <ItemDisplay rate={rate} key={i} data={data} update={update} />
        })}
        <button onClick={async ()=>{
            setProcessing(true)
            await items.forEachAsync(async ({item,qty}) => {
                let maxQty = getMaxQty(item)
                if(qty === maxQty) {
                    await item.delete()
                } else {
                    await item.update({"data.quantity": maxQty - qty})
                }
            })
            await self.update(buildGoldUpdate(totalValue, self))
            app.close()
        }}>Complete Sale <i className="fas fa-coins" /> {totalValue} [{totalRealValue}]</button>
    </div>
}