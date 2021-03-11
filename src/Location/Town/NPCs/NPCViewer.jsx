export default function NPCViewer({npc, update, self}) {
    let jobComponent = npc.getJobComponent(update)
    return <div className="dnd5e sheet actor">
        <img src={npc.data.img} width="32px" />
        {npc.data.name}
        {jobComponent}
        <pre>
            {JSON.stringify(npc, null, 2)}
        </pre>
    </div>
}