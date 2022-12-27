import { CommandCommentParser } from './CommandCommentParser'
import { CommandStatus } from './CommandStatus'

export class CommandComment {
    #config
    #commentsRepository
    #comment
    #parser

    constructor(comment, config, commentsRepository) {
        this.#comment = comment
        this.#config = config
        this.#commentsRepository = commentsRepository

        this.setupData(comment)
    }

    get command() {
        return this.#parser.command
    }

    get status() {
        return this.#parser.status
    }

    get isLeftByAssistantController() {
        if (this.#config.assistantControllers.length === 0) {
            return true
        } else {
            return this.#config.assistantControllers.some((controller) => {
                return controller === this.#comment.author
            })
        }
    }

    get isPending() {
        return this.status === CommandStatus.PENDING || this.status === CommandStatus.UNDEFINED
    }

    async setStatus(status) {
        this.#parser.status = status
        await this.updateComment()
    }

    async setBody(data) {
        this.#parser.body = data
        await this.updateComment()
    }

    async setBodyAndStatus(data, status) {
        this.#parser.body = data
        this.#parser.status = status
        await this.updateComment()
    }

    async setCodeBodyAndStatus(data, status) {
        this.#parser.body = `\`\`\`\n${data}\n\`\`\``
        this.#parser.status = status
        await this.updateComment()
    }

    async updateComment() {
        const newComment = await this.#commentsRepository.editComment(this.#comment.id, this.#parser.comment)
        this.setupData(newComment)
    }

    setupData(comment) {
        this.#comment = comment
        this.#parser = new CommandCommentParser(this.#config, comment.body)
    }
}
