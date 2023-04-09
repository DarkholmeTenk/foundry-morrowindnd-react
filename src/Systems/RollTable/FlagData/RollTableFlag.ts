import getFlag from "Util/Helper/FlagHelper";

export const RollTableFlagKey = "RollTableData"

export interface RollTableFlag {
    tableId?: string | undefined
}

export function getRollTableFlag(table: RollTable) {
    return getFlag<RollTableFlag>(table, RollTableFlagKey, {})
}