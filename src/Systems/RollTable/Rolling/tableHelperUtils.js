import {getSubFolders} from "Util/Helper/FolderHelper";
import LogFactory from "Util/Logging";
import {isCompendiumItemInPath} from "../../../Interop/CompendiumFolders";

const log = LogFactory("TableHelperUtils")

const rarity = ["common", "uncommon", "rare", "very rare", "legendary", "artifact"]

function getCompareFunction(comparator, target) {
	switch(comparator) {
		case "=": return (v)=>v == target;
		case "<=": return (v)=>v <= target;
		case ">=": return (v)=>v >= target;
		case "<": return (v)=>v < target;
		case ">": return (v)=>v > target;
		case "!=": return  (v)=>v != target
		case " in ": return (v)=>target.split(",").includes(v)
		case " !in ": return (v)=>!target.split(",").includes(v)
		case " includes ": return (v)=>v.includes(target)
		case " !includes ": return (v)=>!v.includes(target)
		case "~=": {
			let l = target.toLowerCase()
			return (v)=>v.toLowerCase() === l
		}
	}
}

const specialFilters = {
	"lrare": (target)=>{
		let index = rarity.indexOf(target.toLowerCase())
		if(index !== -1) {
			return (_,{system:{rarity: v}}) => rarity.indexOf(v.toLowerCase()) !== -1 && rarity.indexOf(v.toLowerCase()) < index
		}
	},
	"rarer": (target)=>{
		let index = rarity.indexOf(target.toLowerCase())
		if(index !== -1) {
			return (_,{system:{rarity: v}}) => rarity.indexOf(v.toLowerCase()) !== -1 && rarity.indexOf(v.toLowerCase()) > index
		}
	},
	"inside": (target) =>{
		let folders = getSubFolders(target)
		return (_,itemData)=>{
			let doc = itemData.document
			if(doc) {
				return doc.pack ? isCompendiumItemInPath(itemData, target) : folders.includes(itemData.folder)
			} else {
				return folders.includes(itemData.folder) || isCompendiumItemInPath(itemData, target)
			}
		}
	},
	"!enchanted": ()=>{
		return (_,itemData)=>!itemData.flags["MorrowinDnDReact"]?.enchanter_data
	},
	"enchanted": ()=>{
		return (_,itemData)=>itemData.flags["MorrowinDnDReact"]?.enchanter_data
	},
	"melee": ()=>(_,itemData)=>itemData.system.weaponType?.endsWith("M") || false,
	"ranged": ()=>(_,itemData)=>itemData.system.weaponType?.endsWith("R") || false,
	"spell": ()=>(_,itemData)=>itemData.type === "spell",
	"weapon": ()=>(_,itemData)=>itemData.type === "weapon"
}

function getFilter(argument) {
	let split = argument.match(/^(.+?)(=|<=|>=|<|>| in | !in | includes | !includes |!=|~=)(.+)$/)
	if(split) {
		log.debug("Found regular filter", argument, split)
		let [, field, comparator, target] = split
		let compareFunction = getCompareFunction(comparator, target)
		return {field, compareFunction}
	} else {
		for(let specialFilterName in specialFilters) {
			let match = argument.match(`^(.*?) ?\\$${specialFilterName} ?(.*)$`)
			if(match)  {
				log.debug("Found special filter", specialFilterName, argument, match)
				let [, field, target] = match
				let compareFunction = specialFilters[specialFilterName](target)
				return {field, compareFunction}
			}
		}
	}
}

function filterItem(filters) {
	return (item)=>{
		return filters.every(filter=>{
			let {field, compareFunction} = filter
			if(field.startsWith("data.")) field.replace("data.", "system.")
			let propValue = getProperty(item._source, field)
			return compareFunction(propValue, item._source)
		})	
	}
}

export function parseArguments(args) {
	let specialArguments = args.filter(a=>a.startsWith("@"))
	let filterArguments = args.filter(a=>!a.startsWith("@")).map(a=>getFilter(a)).filter(a=>a)
	let result = {
		args: {},
		filters: [],
		filterItem: (item)=>true
	}
	specialArguments.forEach(a=>{
		let match = a.match(/(.+?)=(.+)/)
		if(match) {
			let [, field, target] = match
			field = field.substring(1)
			result.args[field] = target
		} 
	})
	filterArguments.forEach((filter)=>{
		result.filters.push(filter)
	})
	result.filterItem = filterItem(result.filters)
	log.debug("Built argument table", result)
	return result
}