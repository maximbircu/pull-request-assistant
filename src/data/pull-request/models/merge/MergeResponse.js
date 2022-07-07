export class MergeResponse {
    #sha
    #merged

    constructor(sha, merged) {
        this.#sha = sha
        this.#merged = merged
    }

    static createFromRawData(rawMergeResponseRawData) {
        return new MergeResponse(rawMergeResponseRawData.sha, rawMergeResponseRawData.merged)
    }

    get sha() {
        return this.#sha
    }

    get merged() {
        return this.#merged
    }
}
