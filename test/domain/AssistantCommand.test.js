import { AssistantCommand } from '../../src/domain/AssistantCommand'
import { CommandBuilderStub } from '../stubs/domain/CommandBuilderStub'
import { Logger } from '../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../src/infrastructure/utils/ConsolePrinter'

jest.mock('../../src/infrastructure/logging/Logger')

let commandBuilderStub

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
    commandBuilderStub = CommandBuilderStub.createAndSet()
})

test('configures command-comment builder', () => {
    new FakeCommand('fake-command-comment', 'fake command-comment', {})

    expect(commandBuilderStub.exitOverride).toBeCalledWith(null)
    expect(commandBuilderStub.command).toBeCalledWith('fake-command-comment')
    expect(commandBuilderStub.description).toBeCalledWith('fake command-comment')
    expect(commandBuilderStub.action).toBeCalledWith(expect.any(Function))
})

test('executes command-comment', () => {
    const command = new FakeCommand('fake-command-comment', 'fake command-comment', {})
    const args = []

    commandBuilderStub.action.mock.calls[0][0](args)

    expect(Logger.getInstance().infoCollapsible)
        .toBeCalledWith(
            'Running: fake-command-comment',
            'Args: [\n' +
            '\t\n' +
            ']'
        )
    expect(command.execute).toBeCalledWith(args)
})

test('throws error when trying to construct the abstract class', () => {
    expect(() => {
        new AssistantCommand(expect.any(String), expect.any(String), expect.any(Object))
    }).toThrow(new TypeError('Cannot construct an abstract instances!'))
})

class FakeCommand extends AssistantCommand {
    constructor(name, description, config) {
        super(name, description, config)
        super.execute = jest.fn()
    }
}

