jest.mock('@octokit/action')

export class OctokitStub {
    constructor() {
        this.rest = {
            issues: {
                listComments: () => undefined,
                updateComment: () => undefined
            },
            pulls: {
                get: () => undefined,
                merge: () => undefined,
                listReviews: () => undefined,
                listCommits: () => undefined
            },
            checks: {
                listForRef: () => undefined
            }
        }
    }

    enqueueEditComments(newCommentBody) {
        this.rest.issues.updateComment = jest.fn(() => ({ data: newCommentBody }))
    }

    enqueueComments(comments) {
        this.rest.issues.listComments = jest.fn(() => ({ data: comments }))
    }

    enqueuePullRequest(pullRequest) {
        this.rest.pulls.get = jest.fn(() => ({ data: pullRequest }))
    }

    enqueueChecks(checks) {
        this.rest.checks.listForRef = jest.fn(() => ({ data: checks }))
    }

    enqueueMergeResponse(mergeResponse) {
        this.rest.pulls.merge = jest.fn(() => ({ data: mergeResponse }))
    }

    enqueueReviews(reviews) {
        this.rest.pulls.listReviews = jest.fn(() => ({ data: reviews }))
    }

    enqueueCommits(commits) {
        this.rest.pulls.listCommits = jest.fn(() => ({ data: commits }))
    }
}


