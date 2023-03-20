import { getSettings, loadSettings } from "./wrapper/slot-costs.ts";
import {FLAG_SCOPE} from "../../Util/Helper/FlagHelper";

const configOptions = [
	...getSettings()
]

function reload() {
	let config = {}
	configOptions.forEach((setting)=>{
		config[setting.name] = game.settings.get(FLAG_SCOPE, setting.name)
	})
	loadSettings(config);
}

export function registerSettings() {
	configOptions.forEach(setting=>{
		let option = {
			...setting,
			name: game.i18n.localize(`moss.${setting.name}.name`),
			hint: game.i18n.localize(`moss.${setting.name}.hint`),
			scope: "world",
			config: true,
			onChange: reload
		}
		game.settings.register(FLAG_SCOPE, setting.name, option)
	})
	reload();
}