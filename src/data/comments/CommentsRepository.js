import { Comment } from './models/Comment'
import { Logger } from '../../infrastructure/logging/Logger'

export class CommentsRepository {
    #octokit
    #githubContext
    #payload

    constructor(octokit, githubContext) {
        this.#octokit = octokit
        this.#githubContext = githubContext
        this.#payload = this.#githubContext.payload
    }

    async getCommentsForPr(prNumber) {
        const { data: response } = await this.#octokit.rest.issues.listComments({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            issue_number: prNumber
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Get Comments', response)
        return response.map((rawComment) => Comment.createFromRawData(rawComment))
    }

    async editComment(commentId, newBody) {
        const { data: response } = await this.#octokit.rest.issues.updateComment({
            owner: this.#payload.repository.owner.login,
            repo: this.#payload.repository.name,
            comment_id: commentId,
            body: newBody
        })
        Logger.getInstance().debugCollapsibleObject('Octokit Response - Edit Comment', response)
        return Comment.createFromRawData(response)
    }
}
