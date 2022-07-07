const format = require('string-template')

export class MergeCommitMessageBuilder {
    #pullRequestRepository
    #config
    #reviewersProvider
    #templateProvider

    constructor(pullRequestRepository, reviewersProvider, templateProvider, config) {
        this.#pullRequestRepository = pullRequestRepository
        this.#reviewersProvider = reviewersProvider
        this.#templateProvider = templateProvider
        this.#config = config
    }

    async buildMessage(pullRequest) {
        return format(this.#templateProvider.readTemplate(), {
            issue_id: this.getIssueId(pullRequest),
            reviewers: await this.getReviewers(pullRequest),
            description: this.getDescription(pullRequest),
            pr_number: pullRequest.number
        }).trimEnd()
    }

    getIssueId(pullRequest) {
        let issueId = null
        if (this.#config.issueIdProvider) {
            issueId = eval(this.#config.issueIdProvider)(pullRequest)
        }
        return issueId
    }

    async getReviewers(pullRequest) {
        const reviewers = await this.#reviewersProvider.getReviewers(pullRequest)
        let reviewersString = reviewers.join(' ')
        if (this.#config.reviewersProvider) {
            reviewersString = eval(this.#config.reviewersProvider)(reviewers)
        }
        return reviewersString
    }

    getDescription(pullRequest) {
        let description = pullRequest.title
        if (this.#config.descriptionProvider) {
            description = eval(this.#config.descriptionProvider)(pullRequest)
        }
        return description
    }
}
