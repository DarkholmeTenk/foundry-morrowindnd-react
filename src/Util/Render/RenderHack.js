import {RenderHackEnabled, RenderHackMillis} from "./RenderSettings";
import {isEqual} from "../index";
import LogFactory from "../Logging";

let Log = LogFactory("RenderHack")

let nextRender = 0
let lastRenderData = {}
let styleProps = ["color", "alpha", "visible"]

let importantLayerProps = ["visible", "x", "y", "alpha", {"_fillStyle": styleProps, "_lineStyle":styleProps}]
let extras = [
    {
        id: 'view',
        g: ()=>canvas.scene._viewPosition,
        ips: ['x', 'y', 'scale']
    }
]

function getIp(x, ip) {
    if(typeof ip === "string") {
        return {[ip]: x[ip]}
    } else if(typeof ip === "object") {
        let obj = {}
        Object.keys(ip).forEach(ipKey=>{
            if(!x[ipKey]) {
                obj[ipKey] = null
                return
            }
            let newObj = {}
            ip[ipKey].forEach(subProp=>newObj[subProp] = getIp(x[ipKey], subProp))
            obj[ipKey] = newObj
        })
        return obj
    }
}

function getIps(x, ips) {
    let ip = {}
    ips.forEach(y=>Object.assign(ip, getIp(x, y)))
    return ip
}

function buildData(x, importantProps) {
    let ip = getIps(x, importantProps)
    return {
        data: x,
        ip,
        children: (x.children || []).map(y=>buildData(y, importantProps))
    }
}

function isSame(a, b, importantProps) {
    if(a.data != b) return false
    if(a.children.length != (b.children || []).length) return false
    if(!isEqual(a.ip, getIps(b, importantProps))) return false
    return a.children.every((x,i)=>isSame(a.children[i], b.children[i], importantProps))
}

function runCheck(x, name, importantProps) {
    let oldData = lastRenderData[name]
    let same = oldData && isSame(oldData, x, importantProps)
    if(!same) lastRenderData[name] = buildData(x, importantProps)
    return same
}

function time() {
    return canvas.app._ticker.lastTime
}

function checkData() {
    let results = canvas.layers.map(layer=>{
        return runCheck(layer, layer.name, importantLayerProps)
    })
    let extraResults = extras.map(({id, g, ips})=>runCheck(g(), id, ips))
    return [...results, ...extraResults].some(x=>!x)
}

let renderedLastTick = false
function state(running) {
    if(running && !renderedLastTick) {
        Log.debug("Render starting")
    } else if(!running && renderedLastTick) {
        Log.debug("Render stopping")
    }
    renderedLastTick = running
}

Hooks.on("ready",()=>{
    if(RenderHackEnabled.value) {
        let renderedLastTick = false
        let timeBetweenRenders = RenderHackMillis.value
        canvas.app.renderer.realRender = canvas.app.renderer.render
        canvas.app.renderer.render = function () {
            let t = time()
            if (t < nextRender) {
                state(true)
                this.realRender(...arguments)
            } else if (nextRender == 0 || checkData()) {
                state(true)
                nextRender = t + timeBetweenRenders
                this.realRender(...arguments)
            } else {
                state(false)
            }
        }
    }
})
