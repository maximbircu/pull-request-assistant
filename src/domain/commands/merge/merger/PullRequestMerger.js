import { Logger } from '../../../../infrastructure/logging/Logger'

export class PullRequestMerger {
    constructor() {
        this._logger = Logger.getInstance()
        if (new.target === PullRequestMerger) {
            throw new TypeError('Cannot construct an abstract instances!')
        }
    }

    async run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment) {
    }
}
