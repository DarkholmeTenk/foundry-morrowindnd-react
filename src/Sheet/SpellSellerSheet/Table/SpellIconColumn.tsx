import {SpellSchools} from "Util/Components/NewItemTable/ItemTypes";
import {Tooltip} from "@material-ui/core";
import React from "react";

export function SpellIcon({item}: { item: ItemSpell }) {
    let school = SpellSchools[item.system.school]
    if (school) {
        return <Tooltip title={school.name}><i className={school.icon}/></Tooltip>
    } else {
        return <div>{item.system.school}</div>
    }
}