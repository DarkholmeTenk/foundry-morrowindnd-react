type LogFunction = (message: string, ...args)=>void
interface Logger {
    (message:string, ...args): void
    error: LogFunction
    warn: LogFunction,
    debug: LogFunction
}
export default function LogFactory(feature): Logger {
    let prefix = `MORROWINDND | ${feature.toUpperCase()} | `
    let logger: any = function(message, ...args) {console.log(prefix + message, ...args)}
    logger.error = function(message, ...args) {console.error(prefix + message, ...args)}
    logger.warn = function(message, ...args) {console.warn(prefix + message, ...args)}
    logger.debug = function(message, ...args) {console.debug(prefix + message, ...args)}
    return logger
}