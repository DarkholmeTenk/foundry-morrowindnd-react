export default function ItemDescription({description}) {
    return <div style={{wordWrap: "auto" }} dangerouslySetInnerHTML={{__html: description}} />
}