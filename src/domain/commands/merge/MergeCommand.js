import { AssistantCommand } from '../../AssistantCommand'
import { MergeMethod } from '../../../data/pull-request/models/merge/MergeMethod'
import { CommandStatus } from '../../command-comment/CommandStatus'

export class MergeCommand extends AssistantCommand {
    #pullRequestRepository
    #mergeCommitMessageBuilder
    #pullRequestMergerFactory
    #commandCommentController
    #mergeabilityProvider

    constructor(
        config,
        pullRequestRepository,
        mergeCommitMessageBuilder,
        pullRequestMergerFactory,
        commandCommentController,
        mergeabilityProvider
    ) {
        super('merge', 'Will merge the Pull Request', config)
        this.#pullRequestRepository = pullRequestRepository
        this.#mergeCommitMessageBuilder = mergeCommitMessageBuilder
        this.#pullRequestMergerFactory = pullRequestMergerFactory
        this.#commandCommentController = commandCommentController
        this.#mergeabilityProvider = mergeabilityProvider
    }

    configure(command) {
        command
            .option('-d, --dry-run', 'Runs the command but doesn\'t execute any action.')
            .option(
                '--merge-method <METHOD>',
                'The merge method to be used when merging the Pull Request. (merge/squash/rebase)',
                this._config.defaultMergeMethod
            )
    }

    async execute(args) {
        const { dryRun, mergeMethod } = args
        const commandComment = this.#commandCommentController.activeCommandComment
        const pullRequest = await this.#pullRequestRepository.getCurrentBuildPullRequest()
        const mergeCommitMessage = await this.#mergeCommitMessageBuilder.buildMessage(pullRequest)
        const mergeability = await this.#mergeabilityProvider.getMergeability(pullRequest)

        if (await this.validateMergeMethod(mergeMethod, commandComment)) {
            const merger = this.#pullRequestMergerFactory.create(dryRun)
            await merger.run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment)
        }
    }

    async validateMergeMethod(mergeMethod, commandComment) {
        const message = `The merge method "${mergeMethod}" is not supported!\nTry using one of (merge/squash/rebase)`
        if (MergeMethod.getMethodFromText(mergeMethod) == null) {
            await commandComment.setCodeBodyAndStatus(message, CommandStatus.FAILED)
            this._logger.error(message)
            return false
        }
        return true
    }
}
