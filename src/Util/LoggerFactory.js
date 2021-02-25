import getLoggerFactory from "@darkholme/foundry-react-core/src/Util/Logging";

const LoggerFactory = getLoggerFactory("MorrowinDnD")

export default function getLogger(feature) {
    return LoggerFactory(feature)
}