export function isCompendiumItemInPath(itemData: any, path: string): boolean {
    let basePath = path
    if(!basePath.endsWith("/")) basePath += "/"
    let itemPath = itemData?.flags?.cf?.path ?? ""
    if(itemPath != "") {
        let fixed = itemPath.replaceAll("#/CF_SEP", "")
        return fixed.startsWith(basePath)
    } else {
        return false
    }
}