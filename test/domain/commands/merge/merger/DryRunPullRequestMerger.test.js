import {
    DryRunPullRequestMerger
} from '../../../../../src/domain/commands/merge/merger/DryRunPullRequestMerger'
import {
    DryRunMessageBuilderStub
} from '../../../../stubs/domain/commands/merge/message-builders/dry-run/DryRunMessageBuilderStub'
import { CommandCommentStub } from '../../../../stubs/domain/command-comment/CommandCommentStub'
import { CommandStatus } from '../../../../../src/domain/command-comment/CommandStatus'
import { Logger } from '../../../../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../../../src/infrastructure/utils/ConsolePrinter'

const dryRunMessageBuilderStub = new DryRunMessageBuilderStub()

jest.mock('../../../../../src/infrastructure/logging/Logger')

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
})

test('merges pull request properly', async () => {
    const merger = new DryRunPullRequestMerger(dryRunMessageBuilderStub)
    const pullRequest = {}
    const mergeMethod = 'merge'
    const mergeCommitMessage = 'Merge commit message'
    const mergeability = { mergeable: true }
    const commandComment = new CommandCommentStub()
    dryRunMessageBuilderStub.enqueueMessage('Merge dry run message')

    await merger.run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment)

    expect(commandComment.setCodeBodyAndStatus).toBeCalledWith(
        'Merge dry run message',
        CommandStatus.EXECUTED
    )
    expect(Logger.getInstance().info).toBeCalledWith('\nMerge dry run message')
})
