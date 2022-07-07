import { CommandStatus } from './CommandStatus'

export class CommandCommentParser {
    #config
    #commandCommentText

    constructor(config, commandCommentText) {
        this.#config = config
        this.#commandCommentText = commandCommentText

        this._command = this.parseCommandText()
        this._statusText = this.parseStatusText()
        this._status = CommandStatus.getStatusFromText(commandCommentText)
        this._body = this.parseBodyText()
    }

    get comment() {
        let comment = this._command
        if (this._body) {
            comment += `\n\n${this._body}`
        }
        if (this._statusText) {
            comment += `\n\n${this._statusText}`
        }
        return comment
    }

    get command() {
        return this._command
    }

    get status() {
        return this._status
    }

    set status(value) {
        this._status = value
        this._statusText = CommandStatus.getStatusText(value)
    }

    get body() {
        return this._body
    }

    set body(value) {
        this._body = value
    }

    parseCommandText() {
        return this.#commandCommentText.match(`${this.#config.assistantName}.*`)[0]
            .trim()
    }

    parseBodyText() {
        return this.#commandCommentText
            .replace(this._command, '')
            .replace(this._statusText, '')
            .trim()
    }

    parseStatusText() {
        return CommandStatus.getStatusTextFromText(this.#commandCommentText)
    }
}
