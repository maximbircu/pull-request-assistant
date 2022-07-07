import { CommandBuilderProvider } from '../../../src/domain/CommandBuilderProvider'

export class CommandBuilderStub {
    exitOverride = jest.fn(() => this)
    command = jest.fn(() => this)
    description = jest.fn(() => this)
    action = jest.fn()
    name = jest.fn(() => this)
    configureOutput = jest.fn()
    parseAsync = jest.fn()
    option = jest.fn(() => this)

    static createAndSet() {
        const commandBuilderStub = new CommandBuilderStub()
        CommandBuilderProvider.init(commandBuilderStub)
        return commandBuilderStub
    }

    enqueueParseAsyncFailure(error) {
        this.parseAsync = jest.fn(async () => {
            throw error
        })
    }
}
