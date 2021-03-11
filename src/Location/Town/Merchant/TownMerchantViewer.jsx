function MerchantViewer({merchant}) {
    return <div key={merchant.id} onClick={()=>merchant.actor.sheet.render(true, {token: merchant})}>
        <img style={{width: "32px", height: "32px"}} src={merchant.img} />
        {merchant.name}
    </div>
}

export default function TownMerchantViewer({merchants}) {
    if(merchants.length === 0) return null
    return <div>
        {merchants.map((merchant)=><MerchantViewer merchant={merchant} key={merchant.id} />)}
    </div>
}