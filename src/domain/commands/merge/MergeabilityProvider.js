export class MergeabilityProvider {
    #pullRequestRepository
    #reviewsProvider
    #githubContext
    #config

    constructor(pullRequestRepository, reviewsProvider, githubContext, config) {
        this.#pullRequestRepository = pullRequestRepository
        this.#reviewsProvider = reviewsProvider
        this.#githubContext = githubContext
        this.#config = config
    }

    async getMergeability(pullRequest) {
        const reviewers = await this.#reviewsProvider.getReviewers(pullRequest)
        const allChecksPassed = await this.checksPassed(pullRequest)
        const haveEnoughApproves = reviewers.length >= this.#config.requiredNumberOfApprovals

        if (!haveEnoughApproves) {
            return { mergeable: false, reason: 'Doesn\'t have enough approves!' }
        }

        if (!allChecksPassed) {
            return { mergeable: false, reason: 'Not all the checks passed' }
        }

        if (!pullRequest.isMergeable) {
            return {
                mergeable: false,
                reason: 'There is something wrong with mergeability, are there any conflicts?'
            }
        }


        return { mergeable: true, reason: null }
    }

    async checksPassed(pullRequest) {
        console.table(this.#config)
        const checkRuns = await this.#pullRequestRepository.getChecks(pullRequest)
        console.table(checkRuns[0])
        return checkRuns.filter((check) => check.name in this.#config.requiredChecks)
            .every((check) => check.isCompletedSuccessfully)
    }
}
