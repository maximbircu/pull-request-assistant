export class PullRequestReview {
    #user
    #state
    #timestamp

    constructor(user, state, timestamp) {
        this.#user = user
        this.#state = state
        this.#timestamp = timestamp
    }

    get user() {
        return this.#user
    }

    get state() {
        return this.#state
    }

    get timestamp() {
        return this.#timestamp
    }

    static createFromRawData(rawReview) {
        return new PullRequestReview(rawReview.user.login, rawReview.state, rawReview.submitted_at)
    }
}
