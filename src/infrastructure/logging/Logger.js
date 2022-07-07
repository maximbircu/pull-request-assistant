import { LogLevel } from './LogLevel'

const { INFO, DEBUG, ERROR } = LogLevel

export class Logger {
    #logLeve
    #consolePrinter

    static #instance = null

    static getInstance() {
        return this.#instance
    }

    static init(value) {
        if (this.#instance != null) {
            throw Error('Cant not reset a singleton object')
        }
        this.#instance = value
    }

    constructor(logLeve, consolePrinter) {
        this.#logLeve = logLeve
        this.#consolePrinter = consolePrinter
    }

    info(message) {
        this.#logLeve.runIfAllows(INFO, () => this.#consolePrinter.print(message))
    }

    infoCollapsible(tag, message) {
        this.#logLeve.runIfAllows(
            INFO,
            () => this.#consolePrinter.printCollapsible(tag, message)
        )
    }

    infoCollapsibleObject(tag, object) {
        this.#logLeve.runIfAllows(
            INFO,
            () => this.#consolePrinter.printCollapsibleObject(tag, object)
        )
    }

    debugCollapsible(tag, message) {
        this.#logLeve.runIfAllows(
            DEBUG,
            () => this.#consolePrinter.printCollapsible(tag, message)
        )
    }

    debugCollapsibleObject(tag, object) {
        this.#logLeve.runIfAllows(
            DEBUG,
            () => this.#consolePrinter.printCollapsibleObject(tag, object)
        )
    }

    error(error) {
        this.#logLeve.runIfAllows(ERROR, () => this.#consolePrinter.print(error))
    }
}
