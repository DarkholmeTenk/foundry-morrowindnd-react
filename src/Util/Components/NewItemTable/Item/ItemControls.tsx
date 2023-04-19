import React, {ReactNode} from "react";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";

export function ItemControl({title, icon, onClick}: {title: string, icon: string | ReactNode, onClick: ()=>void}) {
    return <Button tooltip={title} onClick={onClick} icon={icon} />
}