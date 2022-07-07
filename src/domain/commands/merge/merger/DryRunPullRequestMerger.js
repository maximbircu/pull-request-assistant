import { PullRequestMerger } from './PullRequestMerger'
import { CommandStatus } from '../../../command-comment/CommandStatus'

export class DryRunPullRequestMerger extends PullRequestMerger {
    #dryRunMessageBuilder

    constructor(dryRunMessageBuilder) {
        super()
        this.#dryRunMessageBuilder = dryRunMessageBuilder
    }

    async run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment) {
        const dryRunMessage = await this.#dryRunMessageBuilder.buildMessage(
            pullRequest,
            mergeCommitMessage,
            mergeability.mergeable,
            mergeMethod
        )
        await commandComment.setCodeBodyAndStatus(dryRunMessage, CommandStatus.EXECUTED)
        this._logger.info(`\n${dryRunMessage}`)
    }
}
