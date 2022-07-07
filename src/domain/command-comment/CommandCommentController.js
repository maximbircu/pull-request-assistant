import { CommandComment } from './CommandComment'
import { CommandStatus } from './CommandStatus'
import { Logger } from '../../infrastructure/logging/Logger'
import { StringUtils } from '../../infrastructure/utils/StringUtils'

export class CommandCommentController {
    #config
    #commentsRepository
    #activeCommand = null

    constructor(config, commentsRepository) {
        this.#config = config
        this.#commentsRepository = commentsRepository
    }

    async init(prNumber) {
        const commands = await this.getCommands(prNumber)
        this.#activeCommand = this.findActiveCommand(commands)
        await this.cancelWrongOrOldCommands(commands)
    }

    get activeCommandComment() {
        return this.#activeCommand
    }

    findActiveCommand(commands) {
        return commands.reverse().find((command) => command.isPending && command.isLeftByAssistantController)
    }

    async cancelWrongOrOldCommands(commands) {
        for (const command of commands) {
            if (command === this.#activeCommand) continue
            if (!command.isLeftByAssistantController) {
                await this.cancelAndTagControllers(command)
                continue
            }
            if (command.isPending) {
                try {
                    await command.setStatus(CommandStatus.CANCELLED)
                } catch (error) {
                    Logger.getInstance().error(error)
                }
            }
        }
    }

    async cancelAndTagControllers(command) {
        const assistantName = StringUtils.capitalizeFirstLetter(this.#config.assistantName)
        const controllers = this.#config.assistantControllers
            .map((controller) => `@${controller}`)
            .join(',')

        try {
            await command.setBodyAndStatus(
                `Only ${controllers} have rights to execute \`${assistantName}'s\` commands 🤷‍`,
                CommandStatus.CANCELLED
            )
        } catch (error) {
            Logger.getInstance().error(error)
        }
    }

    async getCommands(prNumber) {
        const comments = await this.#commentsRepository.getCommentsForPr(prNumber)
        return comments
            .filter((comment) => comment.body.includes(this.#config.assistantName))
            .map((comment) => new CommandComment(comment, this.#config, this.#commentsRepository))
    }
}
