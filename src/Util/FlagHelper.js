export function getFlag(object, flag, defaultFlag) {
    let flagObj = object.getFlag("morrowindnd", flag) || defaultFlag;
    let setFlag = (newFlag) => object.setFlag("morrowindnd", flag, newFlag);
    return [flagObj, setFlag];
}
