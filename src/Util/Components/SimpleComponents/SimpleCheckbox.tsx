interface Props {
    label: string,
    value: boolean,
    setValue: (v: boolean)=>void
}
export function SimpleCheckbox({label, value, setValue}: Props) {
    return <label className="checkbox">
        <input type="checkbox" checked={value} onChange={e=>setValue(e.target.checked)}/>
        {label}
    </label>
}