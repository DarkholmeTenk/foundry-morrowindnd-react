import React from "react";
import {SellableSourceExtra} from "./Settings";
import {ReactNodeLike} from "prop-types";

interface SellableDisplayProps {
    sellable: SellableSourceExtra
}

function SellableNameDisplay({sellable}: SellableDisplayProps): JSX.Element {
    let name = sellable.name || ""
    return <React.Fragment>{name}</React.Fragment>
}

function SellableIconDisplay({sellable}: SellableDisplayProps): JSX.Element {
    let icon = sellable.icon
    return icon ? <i className={icon}/> : null
}

function SellableInformationDisplay({sellable}: SellableDisplayProps): ReactNodeLike {
    if(sellable.name || sellable.icon) {
        return <div>
            <SellableIconDisplay sellable={sellable} />
            <SellableNameDisplay sellable={sellable} />
        </div>
    }
}