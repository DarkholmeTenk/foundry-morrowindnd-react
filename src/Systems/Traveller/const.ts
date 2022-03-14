import { Setting, TravellerSettings } from "./Settings.js"

export interface P2PRouteType {
    id: string,
    color: number,
    key: string,
    setting: Setting
}

export const p2pRoutes: P2PRouteType[] = [
    {id: "siltstrider", color: 0xffcf29, key:"Traveller.SiltStrider", setting: TravellerSettings.ShowSiltStrider},
    {id: "boat", color: 0x0090ff, key:"Traveller.Boat", setting: TravellerSettings.ShowBoat},
    {id: "propylon", color: 0x23cd67, key:"Traveller.Propylon", setting: TravellerSettings.ShowPropylon}
]

export interface TeleportType {
    id: string,
    key: string,
    color: number,
    proximity: boolean
}

export const teleportation: TeleportType[] = [
    {id: "almsivi", key: "Traveller.Almsivi", color: 0xFF9829, proximity: true},
    {id: "divine", key: "Traveller.Divine", color: 0xFF0C00, proximity: true},
    {id: "direct", key: "Traveller.Direct", color: 0xCD23CB, proximity: false}
]