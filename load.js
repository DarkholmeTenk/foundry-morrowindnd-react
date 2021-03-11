const BundleURL = `${document.currentScript.src.replace("/load.js", "")}/dist/bundle.js`

window.addReactModule("MorrowinDnD", BundleURL);