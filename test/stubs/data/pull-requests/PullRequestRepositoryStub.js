export class PullRequestRepositoryStub {
    currentPullRequestNumber = null
    mergePullRequest = jest.fn()
    getCommits = jest.fn()
    getChecks = jest.fn()

    enqueueCurrentBuildPullRequest(pullRequest) {
        this.getCurrentBuildPullRequest = jest.fn(async () => pullRequest)
    }

    enqueueMergePullRequest(mergeResponse) {
        this.mergePullRequest = jest.fn(async () => mergeResponse)
    }

    enqueueCommits(commits) {
        this.getCommits = jest.fn(async () => commits)
    }

    enqueueChecks(checks) {
        this.getChecks = jest.fn(async () => checks)
    }
}
