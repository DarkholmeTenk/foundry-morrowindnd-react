import {loadPack as lp, getPackId} from "../Identifiers/PackId" ;

async function loadPack(packName, {failOnNoPack = true}): Promise<Item5e[]>  {
	let pack = game.packs.find(p=>p.metadata.label === packName);
	if(!pack) {
		if(failOnNoPack) {
			throw Error(`No pack found with name ${packName}`);
		} else {
			return [];
		}
	}
	return lp(getPackId(pack))
}

export async function loadPackItems(packNames: string[] | string = [], options = {}): Promise<Item5e[]> {
	if(typeof(packNames) === "string") {
		return loadPack(packNames, options)
	} else {
		let items = await Promise.all(packNames.map(async (packName)=>loadPack(packName, options)))
		return items.flatMap(i=>i)
	}
}