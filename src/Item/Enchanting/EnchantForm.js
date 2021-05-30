import EnchantingFormComponent from "./EnchantingFormComponent";
import {isSpellEnchantable} from "./Enchanter";
import LogFactory from "../../Util/Logging";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

const log = LogFactory("EnchantForm")

function canFix(item) {
	let {value, max, per} = item.data.data.uses || {value: 0, max:0, per:""} 
	if(item.data.type === "equipment" && max > 0 && per == "day") {
		return true;
	}
}

Hooks.on("itemSheetMenuItems", async (addMenuItem, app)=>{
	let item = app.object
	if(game.user.isGM && isSpellEnchantable(item.data)) {
		addMenuItem({
			name: "Set Enchant",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: ()=>{
				log("Creating Enchantment Form", item)
				new SimpleReactApplication(<EnchantingFormComponent item={item}/>, {width:300, height: 260}).render(true)
			}
		})
	}
	if(item.owner && canFix(item)) {
		addMenuItem({
			name: "Fix",
			icon: '<i class="fas fa-hammer"></i>',
			callback: async ()=>{
				log("Fix Item", item)
				await item.update({"type": "consumable", "data.consumableType": "trinket"})
			}
		})
	}
})