import { CommandComment } from '../../../src/domain/command-comment/CommandComment'
import { CommentsRepositorySub } from '../../stubs/data/comments/CommentsRepositorySub'
import { CommandStatus } from '../../../src/domain/command-comment/CommandStatus'
import { Comment } from '../../../src/data/comments/models/Comment'
import { RunLinkProvider } from '../../../src/infrastructure/utils/RunLinkProvider'

const commentsRepositorySub = new CommentsRepositorySub()
const fakeConfig = { assistantName: 'friday', assistantControllers: ['maximbircu'] }

describe('parses properly the command comment', () => {
    test('provides proper command comment data', () => {
        const commentBody = 'friday -h\n\n' +
            'body\n\n' +
            '**Executed** [_(details)_](https://github.com/maximbircu/repo/actions/runs/2353615) 🟢'
        const comment = new Comment('maximbircu', commentBody, 1)
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        expect(command.command).toBe('friday -h')
        expect(command.status).toBe(CommandStatus.EXECUTED)
        expect(command.isLeftByAssistantController).toBeTruthy()
        expect(command.isPending).toBeFalsy()
    })

    test('returns false in case the comment is not left by an assistant controller', () => {
        const commentBody = 'friday -h\n\n' +
            'body\n\n' +
            '**Executed** [_(details)_](https://github.com/maximbircu/repo/actions/runs/2353615) 🟢'
        const comment = new Comment('bob', commentBody, 1)
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        expect(command.isLeftByAssistantController).toBeFalsy()
    })

    test('returns true if the command status is pending', () => {
        const comment = new Comment(
            'bob',
            'friday -h\n\n' +
            'body\n\n' +
            '**Pending** [_(details)_]' +
            '(https://github.com/maximbircu/pr-auto-merge-playground/actions/runs/2353615949) 🟡',
            1
        )
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        expect(command.isPending).toBeTruthy()
    })

    test('returns true if the command status is undefined', () => {
        const comment = new Comment('bob', 'friday -h\n\nbody\n', 1)
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        expect(command.isPending).toBeTruthy()
    })
})

describe('updates command comment properly', () => {
    test('updates command comment status', () => {
        RunLinkProvider.linkToRun = 'https://github.com/maximbircu/actions/runs/2353615949'
        const comment = new Comment('bob', 'friday -h\n\nbody\n', 1)
        const newComment = 'friday -h\n\nbody\n\n' +
            '**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2353615949) 🟡'
        commentsRepositorySub.enqueueEditComment(() => new Comment('bob', newComment, 1))
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        command.setStatus(CommandStatus.PENDING)

        expect(commentsRepositorySub.editComment).toBeCalledWith(1, newComment)
    })

    test('updates command comment body', () => {
        RunLinkProvider.linkToRun = 'https://github.com/maximbircu/actions/runs/2353615949'
        const comment = new Comment('bob', 'friday -h\n\nbody\n', 1)
        const newComment = 'friday -h\n\nnew body'
        commentsRepositorySub.enqueueEditComment(() => new Comment('bob', newComment, 1))
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        command.setBody('new body')

        expect(commentsRepositorySub.editComment).toBeCalledWith(1, newComment)
    })

    test('updates command comment body and status', () => {
        RunLinkProvider.linkToRun = 'https://github.com/maximbircu/actions/runs/2353615949'
        const comment = new Comment('bob', 'friday -h\n\nbody\n', 1)
        const newComment = 'friday -h\n\nnew body\n\n' +
            '**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2353615949) 🟡'
        commentsRepositorySub.enqueueEditComment(() => new Comment('bob', newComment, 1))
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        command.setBodyAndStatus('new body', CommandStatus.PENDING)

        expect(commentsRepositorySub.editComment).toBeCalledWith(1, newComment)
    })

    test('updates set code body and status', () => {
        RunLinkProvider.linkToRun = 'https://github.com/maximbircu/actions/runs/2353615949'
        const comment = new Comment('bob', 'friday -h\n\nbody\n', 1)
        const newComment = 'friday -h\n\n\`\`\`\nnew body\n\`\`\`\n\n' +
            '**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2353615949) 🟡'
        commentsRepositorySub.enqueueEditComment(() => new Comment('bob', newComment, 1))
        const command = new CommandComment(comment, fakeConfig, commentsRepositorySub)

        command.setCodeBodyAndStatus('new body', CommandStatus.PENDING)

        expect(commentsRepositorySub.editComment).toBeCalledWith(1, newComment)
    })
})


