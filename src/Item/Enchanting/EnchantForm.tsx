import EnchantingFormComponent from "./EnchantingFormComponent";
import {isSpellEnchantable} from "./Enchanter";
import LogFactory from "../../Util/Logging";
import {SimpleReactApplication} from "../../Util/React/ReactApplication";

const log = LogFactory("EnchantForm")

Hooks.on("itemSheetMenuItems", async (addMenuItem, app)=>{
	let item: Item5e = app.object
	if(game.user.isGM && isSpellEnchantable(item._source)) {
		addMenuItem({
			name: "Set Enchant",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: ()=>{
				log("Creating Enchantment Form", item)
				new SimpleReactApplication(<EnchantingFormComponent item={item} />, {width:410, height: 280}).render(true)
			}
		})
	}
})