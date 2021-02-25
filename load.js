const BundleURL = `${document.currentScript.src.replace("/load.js", "")}/dist/bundle.js`

CONFIG.debug.hooks = true
Hooks.on("reactReady", (loader)=>{
    loader("MorrowinDnD", BundleURL)
})