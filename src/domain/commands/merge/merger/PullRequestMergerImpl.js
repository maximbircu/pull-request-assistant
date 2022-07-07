import { PullRequestMerger } from './PullRequestMerger'
import { CommandStatus } from '../../../command-comment/CommandStatus'

export class PullRequestMergerImpl extends PullRequestMerger {
    #pullRequestRepository

    constructor(pullRequestRepository) {
        super()
        this.#pullRequestRepository = pullRequestRepository
    }

    async run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment) {
        if (mergeability.mergeable) {
            const mergeResponse = await this.#pullRequestRepository.mergePullRequest(
                pullRequest,
                mergeMethod,
                mergeCommitMessage
            )

            if (mergeResponse.merged) {
                const repoUrl = `https://github.com/${pullRequest.repoFullName}`
                const targetBranchCommitsUrl = `${repoUrl}/commits/${pullRequest.targetBranch}`
                const message = `Merged ${mergeResponse.sha} into ${targetBranchCommitsUrl}`
                this._logger.info(message)
                await commandComment.setBodyAndStatus(message, CommandStatus.EXECUTED)
            }
        } else {
            const message = `Can not merge the PR yet 🤷‍\nCause: ${mergeability.reason}` +
                `\n\nWill merge it when it will be ready 👍`
            this._logger.info(message)
            await commandComment.setCodeBodyAndStatus(message, CommandStatus.PENDING)
        }
    }
}
