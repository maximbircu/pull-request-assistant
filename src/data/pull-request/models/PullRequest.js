export class PullRequest {
    #title
    #number
    #isMergeable
    #repo
    #sourceBranch
    #targetBranch
    #description
    #repoFullName
    #headSha

    constructor(
        title,
        number,
        mergeable,
        rebaseable,
        repo,
        sourceBranch,
        targetBranch,
        description,
        repoFullName,
        headSha
    ) {
        this.#title = title
        this.#number = number
        this.#isMergeable = mergeable && rebaseable
        this.#repo = repo
        this.#sourceBranch = sourceBranch
        this.#targetBranch = targetBranch
        this.#description = description
        this.#repoFullName = repoFullName
        this.#headSha = headSha
    }

    static createFromRawData(rawPullRequest) {
        return new PullRequest(
            rawPullRequest.title,
            rawPullRequest.number,
            rawPullRequest.mergeable,
            rawPullRequest.rebaseable,
            rawPullRequest.head.repo.name,
            rawPullRequest.head.ref,
            rawPullRequest.base.ref,
            rawPullRequest.body,
            rawPullRequest.head.repo.full_name,
            rawPullRequest.head.sha
        )
    }

    get title() {
        return this.#title
    }

    get number() {
        return this.#number
    }

    get isMergeable() {
        return this.#isMergeable
    }

    get repo() {
        return this.#repo
    }

    get sourceBranch() {
        return this.#sourceBranch
    }

    get targetBranch() {
        return this.#targetBranch
    }

    get description() {
        return this.#description
    }

    get repoFullName() {
        return this.#repoFullName
    }

    get headSha() {
        return this.#headSha
    }
}
