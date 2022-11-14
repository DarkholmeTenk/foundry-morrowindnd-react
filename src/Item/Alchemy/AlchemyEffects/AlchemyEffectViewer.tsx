import {getAlchemyEffect} from "./AlchemyEffectHelper";
import {Tooltip} from "@material-ui/core";

interface AlchemyEffectViewerArgs {
    id: string
}
export default function AlchemyEffectViewer({id}: AlchemyEffectViewerArgs) {
    let effect = getAlchemyEffect(id)
    if(effect) {
        if(effect.icon && effect.icon !== "") {
            return <Tooltip title={effect.label}>
                <i className={effect.icon} />
            </Tooltip>
        } else {
            return <>
                {effect.label}
            </>
        }
    } else {
        return <div>
            Unknown effect: {id}
        </div>
    }
}