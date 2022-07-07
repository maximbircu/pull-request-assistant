import { Logger } from '../infrastructure/logging/Logger'
import { JsonUtils } from '../infrastructure/utils/JsonUtils'
import { CommandBuilderProvider } from './CommandBuilderProvider'

export class AssistantCommand {
    constructor(name, description = '', config = {}) {
        this._config = config
        this._logger = Logger.getInstance()

        if (new.target === AssistantCommand) {
            throw new TypeError('Cannot construct an abstract instances!')
        }

        this.command = CommandBuilderProvider.builder
            .exitOverride(null)
            .command(name)
            .description(description)

        this.configure(this.command)

        this.command.action((args) => {
            this._logger.infoCollapsible(
                `Running: ${name}`,
                `Args: ${JsonUtils.stringifyAndFormat(args)}`
            )
            this.execute(args)
        })
    }

    configure(command) {
    }

    execute(args) {
    }
}
