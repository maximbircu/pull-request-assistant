export class Comment {
    #author
    #body
    #id

    constructor(author, body, id) {
        this.#author = author
        this.#body = body
        this.#id = id
    }

    static createFromRawData(rawData) {
        return new Comment(rawData.user.login, rawData.body, rawData.id)
    }

    get author() {
        return this.#author
    }

    get body() {
        return this.#body
    }

    get id() {
        return this.#id
    }
}
