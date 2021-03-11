import PropTypes from "prop-types";
import {SpellSeller} from "./SpellSeller";
import {useEffect, useState} from "react";
import SpellViewer from "./SpellViewer";
import {FoundryItemControl} from "./FoundryIconButton";

export default function SpellSellerComponent({data, update, self}) {
    let [spells, setSpells] = useState([])
    useEffect(()=>{
        data.getSellableSpells().then(setSpells)
    }, [data])
    return <div>
        I am a spell seller
        <div className="items-list">
            <ol className="item-list inventory-list">
                {spells.map((spell, id)=><SpellViewer
                    spell={spell} key={id}
                    actions={<FoundryItemControl icon="fas fa-dollar-sign" onClick={()=>console.log("Bought", spell)}/>}
                >
                    <div>{data.getPrice(spell, self)}gp</div>
                </SpellViewer> )}
            </ol>
        </div>
    </div>
}

SpellSellerComponent.propTypes = {
    data: PropTypes.instanceOf(SpellSeller)
}