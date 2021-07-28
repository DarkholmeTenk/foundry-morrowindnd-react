export default function Selector({values, value, setValue, labelFunction=(s)=>`${s}`, includeNull=true, label=""}) {
    let map = {}
    values.forEach((v)=>{
        let label = labelFunction(v)
        if(map[label]) throw Error("Value already exists for " + label + " - " + v)
        map[label] = v
    })
    let selected = !value ? "" : labelFunction(value)
    return <select value={selected} onChange={(e)=>setValue(map[e.target.value])} aria-label={label}>
        {includeNull ? <option value="" /> : null}
        {values.map((v)=>{
            let label = labelFunction(v)
            return <option key={label} value={label}>{label}</option>
        })}
    </select>
}