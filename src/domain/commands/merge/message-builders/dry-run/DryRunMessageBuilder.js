import { MergeMethod } from '../../../../../data/pull-request/models/merge/MergeMethod'

const format = require('string-template')

export class DryRunMessageBuilder {
    #reviewersProvider
    #pullRequestRepository
    #templateProvider

    constructor(reviewersProvider, pullRequestRepository, templateProvider) {
        this.#reviewersProvider = reviewersProvider
        this.#pullRequestRepository = pullRequestRepository
        this.#templateProvider = templateProvider
    }

    async buildMessage(pullRequest, mergeCommitMessage, isMergeable, mergeMethod) {
        return format(this.getTemplate(mergeMethod), {
            mergeability: isMergeable ? `✅` : `❌`,
            merge_method: `${mergeMethod}`,
            reviewers_list: await this.#reviewersProvider.getReviewers(pullRequest),
            merge_commit_message: this.formatMergeCommitMessage(pullRequest, mergeCommitMessage),
            commits: await this.getCommits(pullRequest)
        }).trimEnd()
    }

    getTemplate(mergeMethod) {
        if (mergeMethod === MergeMethod.REBASE) {
            return this.#templateProvider.dryRunRebaseTemplate()
        } else {
            return this.#templateProvider.dryRunTemplate()
        }
    }

    async getCommits(pullRequest) {
        let result = ''
        const commits = await this.#pullRequestRepository.getCommits(pullRequest.number)
        commits.forEach((commit) => {
            result += `\t| ${commit.shortSha} | ${commit.message}\n`
        })
        return result.trimEnd()
    }

    formatMergeCommitMessage(pullRequest, mergeCommitMessage) {
        const commitMessage = mergeCommitMessage.split('\n')
            .map((line) => `\t${line}`)
            .join('\n')

        return `\t${pullRequest.title}\n\n${commitMessage}`
    }
}
