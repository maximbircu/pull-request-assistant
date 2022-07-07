import { RunLinkProvider } from '../../infrastructure/utils/RunLinkProvider'

export class CommandStatus {
    static #statusTextRegexp = /\*\*(.+)\*\* \[_\(details\)_]\(.+\).+/

    static PENDING = 'Pending'
    static EXECUTED = 'Executed'
    static FAILED = 'Failed'
    static CANCELLED = 'Canceled'
    static UNDEFINED = ''

    static getStatusTextFromText(text) {
        const match = text.match(this.#statusTextRegexp)
        return match ? match[0] : null
    }

    static getStatusFromText(text) {
        const match = text.match(this.#statusTextRegexp)
        return match ? match[1] : this.UNDEFINED
    }

    static getStatusText(status) {
        switch (status) {
            case this.PENDING:
                return `**${this.PENDING}** [_(details)_](${RunLinkProvider.linkToRun}) 🟡`
            case this.EXECUTED:
                return `**${this.EXECUTED}** [_(details)_](${RunLinkProvider.linkToRun}) 🟢`
            case this.FAILED:
                return `**${this.FAILED}** [_(details)_](${RunLinkProvider.linkToRun}) 🔴`
            case this.CANCELLED:
                return `**${this.CANCELLED}** [_(details)_](${RunLinkProvider.linkToRun}) ❌`
            case this.UNDEFINED:
                return ''
        }
    }
}
