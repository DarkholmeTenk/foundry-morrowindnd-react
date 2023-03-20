import "./UI/TableModifier"
import "./Rolling/Settings.ts"
import {migrate} from "../Util/Helper/FlagMigrationHelper";

Hooks.on("ready", ()=>{
    migrate(game.tables, {oldScope: "morrowindnd", oldKey: "enchant_spells", newKey: "rollTableFlag"})
})