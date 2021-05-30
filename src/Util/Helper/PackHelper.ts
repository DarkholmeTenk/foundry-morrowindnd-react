let packs: Record<string, Item<any>[]> = {}

async function loadPack(packName, {failOnNoPack = true}): Promise<Item<any>[]>  {
	if(packs[packName]) {
		return packs[packName];
	} else {
		let pack = game.packs.find(p=>p.metadata.label === packName);
		if(!pack) {
			if(failOnNoPack) {
				throw Error(`No pack found with name ${packName}`);
			} else {
				return [];
			}
		}
		packs[packName] = pack.getContent()
		return packs[packName]
	}
}

export async function loadPackItems(packNames = [], options = {}): Promise<Item<any>[]> {
	if(typeof(packNames) === "string") {
		return loadPack(packNames, options)
	} else {
		let items = await Promise.all(packNames.map(async (packName)=>loadPack(packName, options)))
		return items.flatMap(i=>i)
	}
}