import {calculateEnchantValueAdd} from "Constants/SpellConstants";
import LoggerFactory from "../../Util/Logging"
import {setupFolder} from "Util/Helper/FolderHelper";
import {isEqual} from 'Util'
import {FLAG_SCOPE} from "Util/Helper/FlagHelper";
import {getGoldValue} from "Util/Helper/GoldHelper";
import {WeaponEnchantment} from "Systems/RollTable/Rolling/TableWeaponEnchantHelper";

const log = LoggerFactory("Enchanter")

interface ChargeData {
    charges: number
    label: string
    weight: number
}
export const Minor = {charges: 2, label: "Minor", weight: 8}
export const Major = {charges: 5, label: "Major", weight: 3}
export const Superior = {charges: 10, label: "Superior", weight: 1}
export const Immense = {charges: 15, label: "Immense", weight: 0.5}
export const ChargeTypes: ChargeData[] = [Minor, Major, Superior, Immense]

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

type HoldableIData = ItemData & HoldableEntry
interface EnchantProps<T extends HoldableIData> {
    itemData: T
    charges: ChargeData
    spellData: ItemData & SpellEntry
}
export function getEnchantData<T extends HoldableIData>({itemData, charges, spellData}: EnchantProps<T>): ItemData & ConsumableEntry {
    let enchantData = {item: itemData._id, charges: charges, spell: spellData._id}
    let newName = `${itemData.name} of ${charges.label} ${spellData.name}`
    log(`Enchanting item ${newName}`, itemData, charges, spellData)
    let spellLevel = spellData.system.level
    let newGoldValue = Math.floor((getGoldValue(itemData.system.price) * 1.2) + calculateEnchantValueAdd(spellLevel, charges.charges))
    let nestedData: ConsumableData = {
        ...spellData.system,
        description: {value:`${itemData.system.description?.value ?? ""}<br/><br/>${spellData.system.description?.value ?? ""}`},
        consumableType: "trinket",
        weight: itemData.system.weight,
        price: {value: newGoldValue, denomination: "gp"},
        quantity: 1,
        uses: {value: charges.charges, max: charges.charges, per: "day", recovery: '', autoDestroy: false},
        rarity: getRarity(newGoldValue)
    }
    return {
        name: newName,
        ownership: itemData.ownership,
        type: "consumable",
        system: nestedData,
        img: itemData.img,
        flags: {
            [FLAG_SCOPE]: {
                "enchanter_data": enchantData
            }
        }
    }
}

export function isSpellEnchantable(itemData: SmartItemData) {
    return itemData.type === "equipment" && !itemData.flags[FLAG_SCOPE]?.enchanter_data
}

interface EnchantWeaponProps {
    item: Item5e & {type: "weapon"},
    weaponEnchant: WeaponEnchantment,
    renderSheet?: boolean
}
export async function enchantWeapon({item, weaponEnchant, renderSheet = true}: EnchantWeaponProps): Promise<Item> {
    let enchantData = {item: item.id, weaponEnchant}
    let existing = game.items!.find(i=>{
        let enchantedData = i.getFlag("MorrowinDnDReact", "enchanter_data")
        return isEqual(enchantData, enchantedData)
    })
    if(existing) {
        return existing
    }

    let folderId = await setupFolder(`MorrowinDnD/Enchanted Items/Weapons`)
    let newData = deepClone(item._source)
    newData.folder = folderId
    delete newData._id
    weaponEnchant.applyItemModification(newData)

    log("Creating " + newData.name, item, weaponEnchant, newData)
    let newItem = (await Item.create(newData, {temporary: false, renderSheet}))!
    await newItem.setFlag("MorrowinDnDReact", "enchanter_data", enchantData)
    return newItem as Item
}