let currentScriptURL = document.currentScript.src.replace("/dev.js", "")

if(window.location.hostname === "localhost") {
    let script = document.createElement("script")
    script.src = "http://localhost:8080/bundle.js"
    document.head.appendChild(script)
} else {
    import("./dist/bundle.js")
}