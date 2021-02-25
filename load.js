const BundleURL = `${document.currentScript.src.replace("/load.js", "")}/dist/bundle.js`

Hooks.on("reactReady", (loader)=>{
    loader("MorrowinDnD", BundleURL)
})