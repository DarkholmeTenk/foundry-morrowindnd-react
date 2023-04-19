import {SpellSchools} from "Util/Components/NewItemTable/ItemTypes";
import React from "react";
import {Tooltip} from "Util/Components/SimpleComponents/SimpleTooltip";

export function SpellIcon({item}: { item: ItemSpell }) {
    let school = SpellSchools[item.system.school]
    if (school) {
        return <Tooltip text={school.name}><i className={school.icon}/></Tooltip>
    } else {
        return <div>{item.system.school}</div>
    }
}