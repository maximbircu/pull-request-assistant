import {
    PullRequestMergerImpl
} from '../../../../../src/domain/commands/merge/merger/PullRequestMergerImpl'
import { PullRequestRepositoryStub } from '../../../../stubs/data/pull-requests/PullRequestRepositoryStub'
import { CommandCommentStub } from '../../../../stubs/domain/command-comment/CommandCommentStub'
import { Logger } from '../../../../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../../../src/infrastructure/utils/ConsolePrinter'
import { MergeResponse } from '../../../../../src/data/pull-request/models/merge/MergeResponse'
import { CommandStatus } from '../../../../../src/domain/command-comment/CommandStatus'

const pullRequestRepositoryStub = new PullRequestRepositoryStub()
let merger

jest.mock('../../../../../src/infrastructure/logging/Logger')

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
    merger = new PullRequestMergerImpl(pullRequestRepositoryStub)
})

test('merges pull request if mergeable', async () => {
    const pullRequest = {
        repoFullName: 'repo',
        targetBranch: 'master'
    }
    const mergeMethod = 'merge'
    const mergeCommitMessage = 'Merge commit message'
    const mergeability = { mergeable: true }
    const commandComment = new CommandCommentStub()
    pullRequestRepositoryStub.enqueueMergePullRequest(new MergeResponse('123', true))

    await merger.run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment)

    expect(pullRequestRepositoryStub.mergePullRequest)
        .toBeCalledWith(pullRequest, mergeMethod, mergeCommitMessage)
    expect(Logger.getInstance().info)
        .toBeCalledWith('Merged 123 into https://github.com/repo/commits/master')
    expect(commandComment.setBodyAndStatus)
        .toBeCalledWith(
            'Merged 123 into https://github.com/repo/commits/master',
            CommandStatus.EXECUTED
        )
})

test('does not merge the pull request and notifies about this', async () => {
    const pullRequest = {
        repoFullName: 'repo',
        targetBranch: 'master'
    }
    const mergeMethod = 'merge'
    const mergeCommitMessage = 'Merge commit message'
    const mergeability = { mergeable: false, reason: 'Not all the checks passed' }
    const commandComment = new CommandCommentStub()
    pullRequestRepositoryStub.enqueueMergePullRequest(new MergeResponse('123', true))

    await merger.run(pullRequest, mergeMethod, mergeCommitMessage, mergeability, commandComment)

    expect(pullRequestRepositoryStub.mergePullRequest).not
        .toBeCalledWith(pullRequest, mergeMethod, mergeCommitMessage)
    expect(Logger.getInstance().info)
        .toBeCalledWith(
            `Can not merge the PR yet 🤷‍\n` +
            `Cause: Not all the checks passed\n\n` +
            `Will merge it when it will be ready 👍`
        )
    expect(commandComment.setCodeBodyAndStatus)
        .toBeCalledWith(
            `Can not merge the PR yet 🤷‍\n` +
            `Cause: Not all the checks passed\n\n` +
            `Will merge it when it will be ready 👍`,
            CommandStatus.PENDING
        )
})
