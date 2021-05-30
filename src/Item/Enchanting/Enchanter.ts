import {calculateEnchantValueAdd} from "../../Constants/SpellConstants";
import LoggerFactory from "../../Util/Logging"
// @ts-ignore
import {setupFolder} from "../../Util/Helper/FolderHelper";
// @ts-ignore
import {clone, isEqual} from '../../Util'

const log = LoggerFactory("Enchanter")

export const Minor = {charges: 2, label: "Minor", weight: 8}
export const Major = {charges: 5, label: "Major", weight: 3}
export const Superior = {charges: 10, label: "Superior", weight: 1}
export const Immense = {charges: 15, label: "Immense", weight: 0.5}
export const ChargeTypes = [Minor, Major, Superior, Immense]

export function getRandomCharge() {
    let max = ChargeTypes.map(x=>x.weight).reduce((p,c)=>p+c)
    let newRand = Math.random() * max
    for(let i in ChargeTypes) {
        let c = ChargeTypes[i]
        if(newRand <= c.weight) return c
        newRand -= c.weight
    }
    return Minor
}

const valueRarity = [
    {name: "Common", valueMin: 0},
    {name: "Uncommon", valueMin: 300},
    {name: "Rare", valueMin: 1000},
    {name: "Very Rare", valueMin: 10000},
    {name: "Legendary", valueMin: 20000},
    {name: "Artifact", valueMin: 50000},
]

function getRarity(value) {
    let result = valueRarity[0]
    for(let x of valueRarity) {
        if(value >= x.valueMin) {
            result = x
        }
    }
    return result.name
}

export function getEnchantData({itemData, charges, spellData}) {
    let enchantData = {item: itemData._id, charges: charges, spell: spellData._id}
    let newName = `${itemData.name} of ${charges.label} ${spellData.name}`
    log(`Enchanting item ${newName}`, itemData, charges, spellData)
    let spellLevel = spellData.data.level
    let newValue = Math.floor((itemData.data.price * 1.2) + calculateEnchantValueAdd(spellLevel, charges.charges))
    let nestedData = {
        ...spellData.data,
        description: {value:`${itemData.data.description.value}<br/><br/>${spellData.data.description.value}`, chat: "", unidentified: `${itemData.data.description.value}<br/><br/>Unknown enchantment`},
        consumableType: "trinket",
        weight: itemData.data.weight,
        price: newValue,
        quantity: 1,
        uses: {value: charges.charges, max: charges.charges, per: "day"},
        armor: itemData.data.armor,
        rarity: getRarity(newValue)
    }
    let newData = {
        name: newName,
        permission: itemData.permission,
        type: "consumable",
        data: nestedData,
        img: itemData.img,
        flags: {
            "morrowindnd": {
                "enchanter_data": enchantData
            }
        }
    }
    return newData
}

export function isSpellEnchantable(itemData) {
    return itemData.type === "equipment" && !itemData.flags?.morrowindnd?.enchanter_data
}

export async function enchantWeapon({item, weaponEnchant, renderSheet = true}): Promise<Item> {
    let enchantData = {item: item.id, weaponEnchant}
    let existing = game.items.find(i=>{
        let enchantedData = i.getFlag("morrowindnd", "enchanter_data")
        return isEqual(enchantData, enchantedData)
    })
    if(existing) {
        return existing
    }

    let folderId = await setupFolder(`MorrowinDnD/Enchanted Items/Weapons`)
    let newData = clone(item.data)
    newData.folder = folderId
    newData._id = null
    weaponEnchant.apply(newData)

    log("Creating " + newData.name, item, weaponEnchant, newData)
    let newItem = await Item.create(newData, {temporary: false, renderSheet})
    await newItem.setFlag("morrowindnd", "enchanter_data", enchantData)
    return newItem as Item
}