"user strict";
import minimist from "minimist";
import path from "path";
import winston, { format, transports } from "winston";
import Debug from "debug";
const argv = minimist(process.argv.slice(2));
const dataPath = argv.storageLocation ? argv.storageLocation : "data";
const { combine, timestamp, label, colorize } = format;
export const debugLogFile = "debug.log";

const developmentLogger = Debug;

const fileLogger = (prefix: string): any => {
    let colors = [
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white greenBG",
        "white yellowBG",
        "white blueBG",
        "white magentaBG",
        "white cyanBG",
        "black whiteBG"
    ];
    let hash = 0;
    for (let i = 0; i < prefix.length; i++) {
        hash = (hash << 5) - hash + prefix.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    let color = "bold " + colors[Math.abs(hash) % colors.length];

    const colorLevels = {
        levels: {},
        colors: {}
    };
    colorLevels.levels[prefix] = 0;
    colorLevels.colors[prefix] = color;
    winston.addColors(colorLevels.colors);

    const debugFormat = format.printf(info => {
        return `[${info.level}] ${info.timestamp} : ${info.message}`;
    });

    let debug = winston.createLogger({
        levels: colorLevels.levels,
        format: combine(label({ label: prefix }), timestamp(), debugFormat),
        transports: [
            new transports.File({
                filename: path.resolve(dataPath, debugLogFile),
                level: prefix
            }),
            new transports.Console({
                level: prefix,
                format: combine(colorize(), debugFormat)
            })
        ]
    });
    return logMessage => {
        let logMessageStringified: string;
        if (typeof logMessage == "object") {
            try {
                logMessageStringified = JSON.stringify(logMessage, null, 2);
            } catch (e) {
                console.log(e);
            }
        }
        debug.log({
            level: prefix,
            message: logMessageStringified ? logMessageStringified : logMessage
        });
    };
};

export default (process.env.NODE_ENV === "development"
    ? developmentLogger
    : fileLogger);
