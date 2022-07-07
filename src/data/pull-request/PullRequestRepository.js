import { PullRequest } from './models/PullRequest'
import { PullRequestReview } from './models/review/PullRequestReview'
import { Logger } from '../../infrastructure/logging/Logger'
import { Commit } from './models/Commit'
import { MergeResponse } from './models/merge/MergeResponse'
import { MergeMethod } from './models/merge/MergeMethod'
import { CheckRun } from './models/check-run/CheckRun'

export class PullRequestRepository {
    #octokit
    #githubContext
    #payload

    constructor(octokit, githubContext) {
        this.#octokit = octokit
        this.#githubContext = githubContext
        this.#payload = this.#githubContext.payload
    }

    async getCurrentBuildPullRequest() {
        return this.getPullRequest(this.currentBuildPrNumber)
    }

    async getPullRequest(prNumber) {
        const { data: response } = await this.#octokit.rest.pulls.get({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            pull_number: prNumber
        })

        Logger.getInstance().debugCollapsibleObject('Octokit Response - Get Pull Request', response)
        return PullRequest.createFromRawData(response)
    }

    async getChecks(pullRequest) {
        const { data: response } = await this.#octokit.rest.checks.listForRef({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            ref: pullRequest.headSha
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Get Checks', response)
        return response.check_runs.map((rawCheck) => CheckRun.createFromRawData(rawCheck))
    }

    async mergePullRequest(pullRequest, mergeMethod, commitMessage = null) {
        if (mergeMethod === MergeMethod.REBASE) {
            return await this.mergeAndRebase(pullRequest)
        } else {
            return await this.merge(pullRequest, mergeMethod, commitMessage)
        }
    }

    async merge(pullRequest, mergeMethod, commitMessage) {
        if (mergeMethod === MergeMethod.REBASE) {
            throw Error(`Use ${mergeMethod} for a rebase merge`)
        }
        const { data: response } = await this.#octokit.rest.pulls.merge({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            pull_number: pullRequest.number,
            commit_title: pullRequest.title,
            commit_message: commitMessage,
            merge_method: mergeMethod
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Merge Pull Request', response)
        return MergeResponse.createFromRawData(response)
    }

    async mergeAndRebase(pullRequest) {
        const { data: response } = await this.#octokit.rest.pulls.merge({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            pull_number: pullRequest.number,
            merge_method: MergeMethod.REBASE
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Merge Pull Request', response)
        return MergeResponse.createFromRawData(response)
    }

    async getReviews(pullRequestNumber) {
        const { data: response } = await this.#octokit.rest.pulls.listReviews({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            pull_number: pullRequestNumber
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Get Reviews', response)
        return response.map((rawReview) => PullRequestReview.createFromRawData(rawReview))
    }

    async getCommits(pullRequestNumber) {
        const { data: response } = await this.#octokit.rest.pulls.listCommits({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            pull_number: pullRequestNumber
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Get Commits', response)
        return response.map((rawCommit) => Commit.createFromRawData(rawCommit))
    }

    get currentBuildPrNumber() {
        return this.#payload.number || (this.#payload.issue ? this.#payload.issue.number : null) ||
            (this.#payload.pull_request ? this.#payload.pull_request.number : null)
    }
}
