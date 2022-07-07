import { Logger } from '../infrastructure/logging/Logger'
import { CommandStatus } from './command-comment/CommandStatus'
import { CommandBuilderProvider } from './CommandBuilderProvider'

export class Assistant {
    #commands
    #commandCommentController
    #pullRequestRepository
    #process

    constructor(commands, commandCommentController, pullRequestRepository, configProvider, process) {
        this.#commands = commands
        this.#commandCommentController = commandCommentController
        this.#pullRequestRepository = pullRequestRepository
        this.#process = process

        CommandBuilderProvider.builder
            .exitOverride()
            .name(configProvider.config.assistantName)
            .configureOutput({
                writeOut: (str) => {
                    Logger.getInstance().info(str)
                    this.#commandCommentController.activeCommandComment
                        .setCodeBodyAndStatus(str, CommandStatus.EXECUTED)
                        .catch(Logger.getInstance().error)
                },
                writeErr: (str) => {
                    Logger.getInstance().error(str)
                    this.#commandCommentController.activeCommandComment
                        .setCodeBodyAndStatus(str, CommandStatus.FAILED)
                        .catch(Logger.getInstance().error)
                }
            })
    }

    async operate() {
        const prNumber = this.#pullRequestRepository.currentBuildPrNumber
        if (prNumber) {
            await this.#commandCommentController.init(prNumber)
            await this.attemptToExecuteCommand()
        } else {
            Logger.getInstance().info('I can operate only with PRs at the moment! ¯\\_(ツ)_/¯')
        }
    }

    async attemptToExecuteCommand() {
        const commandComment = this.#commandCommentController.activeCommandComment
        if (commandComment) {
            await commandComment.setStatus(CommandStatus.PENDING)
            try {
                const commandArgs = this.#process.argv.concat(commandComment.command.split(' ').slice(1))
                await CommandBuilderProvider.builder.parseAsync(commandArgs)
            } catch (e) {
                switch (e.code) {
                    case 'commander.helpDisplayed':
                    case 'commander.unknownOption':
                    case 'commander.help':
                        break
                    default:
                        await commandComment.setStatus(CommandStatus.FAILED)
                        Logger.getInstance().error(e)
                        break
                }
            }
        } else {
            Logger.getInstance().info('No commands to execute yet!')
        }
    }
}
