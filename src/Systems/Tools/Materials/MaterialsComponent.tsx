import {useSuspensePromise} from "Util/Suspense/SuspenseContext";
import {loadPack} from "Util/Identifiers/PackHelper";
import {ItemPackSetting} from "Systems/RollTable/Rolling/Settings";
import {isItem} from "Util/Identifiers/UuidHelper";
import ItemViewer from "Util/Components/ItemViewer/ItemViewer";
import {NewItemTable} from "Util/Components/NewItemTable/NewItemTable";
import {TableColumn} from "Util/Components/NewItemTable/TableColumn";
import {MeleeMaterials, RangedMaterials, WeaponMaterialData} from "Systems/Tools/Materials/WeaponMaterialData";
import {getterColumn} from "Util/Components/NewItemTable/Util/GetterColumn";
import GoldDisplay from "Util/Components/GoldDisplay/GoldDisplay";
import {useState} from "react";
import {Button} from "Util/Components/SimpleComponents/SimpleButton";
import {ViewIcon} from "Util/Components/SimpleComponents/IconLibrary";
import {DefaultItemColumns} from "Util/Components/NewItemTable/Item/ItemColumns";

function isEquipment(i: any): i is (ItemEquipment | ItemWeapon) {
    return isItem(i) && (i.type === "equipment" || i.type === "weapon")
}

type Type = "melee" | "ranged" | "armor"
interface State {type: Type, material: string}
interface ExtraProps {
    type: Type,
    open: (type: State)=>void
}
const Columns: TableColumn<ExtraProps, WeaponMaterialData>[] = [
    getterColumn("Type", (item)=>item.name),
    getterColumn("Attack Bonus", (item)=>item.attackBonus ?? 0),
    getterColumn("Damage Bonus", (item)=>item.damageBonus ?? 0),
    getterColumn("Hurts Ghosts", (item)=>item.hurtsGhosts ? "Yes": "No"),
    getterColumn("Average Price", (item)=><GoldDisplay value={item.averagePrice}/>),
    {label: "", ColumnComponent: ControlColumn}
]

function ControlColumn({item, type, open}: ExtraProps & {item: WeaponMaterialData}) {
    return <span>
        <Button onClick={()=>open({type, material: item.name})} icon={ViewIcon} />
    </span>
}

const MeleeTypes = ["simpleM", "martialM"]
const RangedTypes = ["simpleR", "martialR"]
const ArmorTypes = ["heavy", "light", "medium", "shield"]
function filterToType(item: Item5e, type: Type): boolean {
    if(type === "melee") return item.type === "weapon" && MeleeTypes.includes(item.system.weaponType)
    if(type === "ranged") return item.type === "weapon"  && RangedTypes.includes(item.system.weaponType)
    if(type === "armor") return item.type === "equipment" && ArmorTypes.includes(item.system.armor.type)
    return true
}

function ItemListViewer({items, type, material}: {items: Item5e[], type: Type, material: string}) {
    let filtered = items.filter(x=>filterToType(x, type) && x.name.startsWith(material))
    return <NewItemTable extraData={{}} columns={DefaultItemColumns} items={filtered} />
}

export function MaterialsComponent() {
    let [open, setOpen] = useState<State | undefined>()
    let packData = useSuspensePromise("items", ()=>loadPack(ItemPackSetting.value, isEquipment))
    if(open) {
        return <div>
            <h3>
                Viewing {open.type} - {open.material}
                <Button onClick={()=>setOpen(undefined)} icon={ViewIcon} />
                <ItemListViewer items={packData} type={open.type} material={open.material} />
            </h3>
        </div>
    } else {
        return <div>
            <div>
                <h2>Weapons:</h2>
                <div>
                    <h3>Melee</h3>
                    <NewItemTable extraData={{type: "melee", open: setOpen}} columns={Columns} items={MeleeMaterials} />
                </div>
                <div>
                    <h3>Ranged</h3>
                    <NewItemTable extraData={{type: "ranged", open: setOpen}} columns={Columns} items={RangedMaterials} />
                </div>
            </div>
        </div>
    }
}