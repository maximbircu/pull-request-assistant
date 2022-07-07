import { CommentsRepositorySub } from '../../stubs/data/comments/CommentsRepositorySub'
import { CommandCommentController } from '../../../src/domain/command-comment/CommandCommentController'
import { Logger } from '../../../src/infrastructure/logging/Logger'
import { CommandCommentFactory } from './CommandCommentBodyProvider'
import { CommandStatus } from '../../../src/domain/command-comment/CommandStatus'
import { Comment } from '../../../src/data/comments/models/Comment'
import { LogLevel } from '../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../src/infrastructure/utils/ConsolePrinter'

jest.mock('../../../src/infrastructure/logging/Logger')

const fakeConfig = {
    assistantControllers: ['max'],
    assistantName: 'friday'
}
const commentsRepositoryStub = new CommentsRepositorySub()
const controller = new CommandCommentController(
    fakeConfig,
    commentsRepositoryStub,
    Logger.getInstance()
)

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
    commentsRepositoryStub.enqueueEditComment((id, newComment) => new Comment('', newComment, id))
})

test('considers last valid comment as an active command', async () => {
    const comments = [
        CommandCommentFactory.createComment(1, 'max', 'friday merge -h', CommandStatus.PENDING),
        CommandCommentFactory.createComment(2, 'max', 'friday merge', CommandStatus.PENDING),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.PENDING)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)

    await controller.init(3)

    expect(controller.activeCommandComment.command).toBe('friday -h')
})

test('cancels old active commands', async () => {
    const comments = [
        CommandCommentFactory.createComment(1, 'max', 'friday merge -h', CommandStatus.PENDING),
        CommandCommentFactory.createComment(2, 'max', 'friday merge', CommandStatus.PENDING),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.PENDING)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)

    await controller.init(3)

    expect(commentsRepositoryStub.editComment).toBeCalledWith(
        1,
        CommandCommentFactory.createComment(
            1,
            'max',
            'friday merge -h',
            CommandStatus.CANCELLED
        ).body
    )
    expect(commentsRepositoryStub.editComment).toBeCalledWith(
        2,
        CommandCommentFactory.createComment(1, 'max', 'friday merge', CommandStatus.CANCELLED).body
    )
})

test('cancels wrong commands', async () => {
    const comments = [
        CommandCommentFactory.createComment(2, 'bob', 'friday merge', CommandStatus.PENDING),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.PENDING)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)

    await controller.init(3)

    expect(commentsRepositoryStub.editComment).toBeCalledWith(
        2,
        CommandCommentFactory.createComment(
            2,
            'bob',
            'friday merge',
            CommandStatus.CANCELLED,
            'Only @max have rights to execute `Friday\'s` commands 🤷‍'
        ).body
    )
})

test('returns undefined when there is no active command', async () => {
    const comments = [
        CommandCommentFactory.createComment(2, 'bob', 'friday merge', CommandStatus.CANCELLED),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.EXECUTED)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)

    await controller.init(3)

    expect(controller.activeCommandComment).toBeUndefined()
})

test('logs command status and body update error', async () => {
    const comments = [
        CommandCommentFactory.createComment(2, 'bob', 'friday merge', CommandStatus.PENDING),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.PENDING)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)
    commentsRepositoryStub.enqueueEditCommentError(Error('Status and body update error'))

    await controller.init(3)

    expect(Logger.getInstance().error).toBeCalledWith(Error('Status and body update error'))
})

test('logs command status update error', async () => {
    const comments = [
        CommandCommentFactory.createComment(2, 'max', 'friday merge', CommandStatus.PENDING),
        CommandCommentFactory.createComment(3, 'max', 'friday -h', CommandStatus.PENDING)
    ]

    commentsRepositoryStub.enqueueCommentsForPr(comments)
    commentsRepositoryStub.enqueueEditCommentError(Error('Status update error'))

    await controller.init(3)

    expect(Logger.getInstance().error).toBeCalledWith(Error('Status update error'))
})

