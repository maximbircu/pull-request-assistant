import { Logger } from '../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../src/infrastructure/utils/ConsolePrinter'
import { CommandBuilderStub } from '../stubs/domain/CommandBuilderStub'
import { Assistant } from '../../src/domain/Assistant'
import { CommandCommentControllerStub } from '../stubs/domain/command-comment/CommandCommentControllerStub'
import { CommandStatus } from '../../src/domain/command-comment/CommandStatus'
import { PullRequestRepositoryStub } from '../stubs/data/pull-requests/PullRequestRepositoryStub'
import { ProcessStub } from '../stubs/data/ProcessStub'
import { ConfigProviderStub } from '../stubs/data/ConfigProviderStub'

jest.mock('../../src/infrastructure/logging/Logger')

let commandBuilderStub
let commandCommentControllerStub
let pullRequestRepositoryStub
let configProviderStub
let processStub
let assistant = null

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
    commandBuilderStub = CommandBuilderStub.createAndSet()
    commandCommentControllerStub = new CommandCommentControllerStub()
    pullRequestRepositoryStub = new PullRequestRepositoryStub()
    configProviderStub = new ConfigProviderStub()
    processStub = new ProcessStub()
    assistant = new Assistant(
        [],
        commandCommentControllerStub,
        pullRequestRepositoryStub,
        configProviderStub,
        processStub
    )
})

describe('sets up the assistant properly', () => {
    test('configures the command-comment builder', () => {
        expect(commandBuilderStub.exitOverride).toBeCalled()
        expect(commandBuilderStub.name).toBeCalledWith('friday')
        expect(commandBuilderStub.configureOutput).toBeCalledWith({
            writeOut: expect.any(Function),
            writeErr: expect.any(Function)
        })
    })

    test('logs command-comment output', () => {
        commandBuilderStub.configureOutput.mock.calls[0][0].writeOut('command-comment output')

        expect(Logger.getInstance().info).toBeCalledWith('command-comment output')
        expect(commandCommentControllerStub.activeCommandComment.setCodeBodyAndStatus)
            .toBeCalledWith('command-comment output', CommandStatus.EXECUTED)
    })

    test('logs command-comment error output', () => {
        commandBuilderStub.configureOutput.mock.calls[0][0].writeErr('command-comment error')

        expect(Logger.getInstance().error).toBeCalledWith('command-comment error')
        expect(commandCommentControllerStub.activeCommandComment.setCodeBodyAndStatus)
            .toBeCalledWith('command-comment error', CommandStatus.FAILED)
    })
})

test('notifies about the fact that the assistant operate on PRs only', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = null

    await assistant.operate()

    expect(Logger.getInstance().info).toBeCalledWith(
        'I can operate only with PRs at the moment! ¯\\_(ツ)_/¯'
    )
})

test('initialises command-comment comment controller', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3

    await assistant.operate()

    expect(commandCommentControllerStub.init).toBeCalledWith(3)
})

test('notify in case there are no commands to be executed', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    commandCommentControllerStub.activeCommandComment = null

    await assistant.operate()

    expect(Logger.getInstance().info).toBeCalledWith('No commands to execute yet!')
})

test('sets a pending status when executing the command', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3

    await assistant.operate()

    expect(commandCommentControllerStub.activeCommandComment.setStatus)
        .toBeCalledWith(CommandStatus.PENDING)
})

test('ignores commander.helpDisplayed error', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    commandBuilderStub.enqueueParseAsyncFailure({ code: 'commander.helpDisplayed' })

    await assistant.operate()

    expect(Logger.getInstance().error).not.toBeCalled()
})

test('ignores commander.unknownOption error', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    commandBuilderStub.enqueueParseAsyncFailure({ code: 'commander.unknownOption' })

    await assistant.operate()

    expect(Logger.getInstance().error).not.toBeCalled()
})

test('ignores commander.help error', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    commandBuilderStub.enqueueParseAsyncFailure({ code: 'commander.help' })

    await assistant.operate()

    expect(Logger.getInstance().error).not.toBeCalled()
})

test('sets failed status when an error occurs during command execution', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    const error = Error()
    commandBuilderStub.enqueueParseAsyncFailure(error)

    await assistant.operate()

    expect(commandCommentControllerStub.activeCommandComment.setStatus)
        .toBeCalledWith(CommandStatus.FAILED)
})

test('logs the error in case it happens during command execution', async () => {
    pullRequestRepositoryStub.currentBuildPrNumber = 3
    const error = Error()
    commandBuilderStub.enqueueParseAsyncFailure(error)

    await assistant.operate()

    expect(Logger.getInstance().error).toBeCalledWith(error)
})
