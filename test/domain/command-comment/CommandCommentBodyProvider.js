import { Comment } from '../../../src/data/comments/models/Comment'
import { CommandStatus } from '../../../src/domain/command-comment/CommandStatus'

export class CommandCommentFactory {
    static createComment(id, author, command, status, body = 'body') {
        return new Comment(
            author,
            `${command}\n\n` +
            `${body}\n\n` +
            CommandStatus.getStatusText(status),
            id
        )
    }

    static createCommentBody(command, body, status) {
        return `${command}\n\n${body}\n\n${CommandStatus.getStatusText(status)}`
    }
}
