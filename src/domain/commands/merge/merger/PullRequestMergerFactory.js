import { DryRunPullRequestMerger } from './DryRunPullRequestMerger'
import { PullRequestMergerImpl } from './PullRequestMergerImpl'

export class PullRequestMergerFactory {
    #dryRunMessageBuilder
    #pullRequestRepository

    constructor(dryRunMessageBuilder, pullRequestRepository) {
        this.#dryRunMessageBuilder = dryRunMessageBuilder
        this.#pullRequestRepository = pullRequestRepository
    }

    create(dryRun) {
        if (dryRun) {
            return new DryRunPullRequestMerger(this.#dryRunMessageBuilder)
        } else {
            return new PullRequestMergerImpl(this.#pullRequestRepository)
        }
    }
}
