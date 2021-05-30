import {useState} from "react";

function getComponents(spellData) {
    let {components} = spellData
    let types = [
        {l: "V", v: "vocal"},
        {l: "S", v: "somatic"},
        {l: "M", v: "material"},
        {l: "C", v: "concentration"},
        {l: "R", v: "ritual"},
    ]
    let activeTypes = types.filter(x=>components[x.v])
    return activeTypes.map(x=>x.l)
}

export function SpellComponents({spellData}) {
    let activeTypes = getComponents(spellData)
    return <div className="spell-comps">
        {activeTypes.map(t=><span className={`spell-component ${t}`} key={t}>{t}</span> )}
    </div>
}

export function SpellSchool({school}) {
    return <div className="spell-school">{school}</div>
}

export function SpellAction({action}) {
    let {cost, type} = action
    let text = ""
    if(cost) text = `${cost} ${type}`
    return <div className="spell-action">{text}</div>
}

function build(val) {
    return val ? val + " " : ""
}

function SpellTarget({range, target}) {
    let text = "None"
    let title = ""
    if(target.type) text = build(target.value) + build(target.units) + build(target.type)
    if(range.units) title = `Range: ${build(range.value) + build(range.units)}`
    return <div className="spell-target" title={title}>
        {text}
    </div>
}

function SpellSummary({spell}) {
    let html = {"__html": spell.data?.data?.description?.value || ""}
    return <div className="item-summary" dangerouslySetInnerHTML={html} />
}

export default function SpellViewer({spell, actions, children}) {
    let deepData = spell.data.data
    let [summaryOpen, setSummaryOpen] = useState(false)
    let className = "item flexrow" + (summaryOpen ? " expanded" : "")
    return <li className={className} data-item-id={spell.id} onClick={()=>setSummaryOpen(!summaryOpen)}>
        <div className="item-name flexrow rollable">
            <div className="item-image" style={{backgroundImage: `url('${spell.img}')`}} />
            <h4>
                <a title={spell.name} onClick={()=>spell.sheet.render(true)}>
                    {spell.name}
                </a>
            </h4>
        </div>

        <SpellComponents spellData={deepData} />
        <SpellSchool school={deepData.school} />
        <SpellAction action={deepData.activation}/>
        <SpellTarget target={deepData.target} range={deepData.range} />
        {children}
        {actions ? <div className="item-controls flexrow">{actions}</div> : null}
        {summaryOpen ? <SpellSummary spell={spell} /> : null}
    </li>
}