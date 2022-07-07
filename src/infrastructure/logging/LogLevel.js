export class LogLevel {
    static ERROR = new LogLevel('error', 0)
    static SILENT = new LogLevel('silent', 2)
    static INFO = new LogLevel('info', 3)
    static DEBUG = new LogLevel('debug', 4)

    static levels = [LogLevel.SILENT, LogLevel.INFO, LogLevel.DEBUG]

    constructor(name, priority) {
        this._name = name
        this._priority = priority
    }

    static fromName(name) {
        const logLevel = LogLevel.levels.find((level) => level.name === name)
        if (logLevel == null) throw Error(`${name} not supported!`)
        return logLevel
    }

    runIfAllows(level, action) {
        if (this._priority >= level.priority) {
            action()
        }
    }

    get name() {
        return this._name
    }

    get priority() {
        return this._priority
    }
}
