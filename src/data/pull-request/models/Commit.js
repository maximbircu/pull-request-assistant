export class Commit {
    #sha
    #shortSha
    #message

    constructor(sha, message) {
        this.#sha = sha
        this.#shortSha = sha.slice(0, 7)
        this.#message = message
    }

    static createFromRawData(rawCommitData) {
        return new Commit(rawCommitData.sha, rawCommitData.commit.message)
    }

    get sha() {
        return this.#sha
    }

    get shortSha() {
        return this.#shortSha
    }

    get message() {
        return this.#message
    }
}
