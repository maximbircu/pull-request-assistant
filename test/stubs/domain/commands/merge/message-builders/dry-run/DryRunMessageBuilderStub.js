export class DryRunMessageBuilderStub {
    buildMessage = jest.fn()

    enqueueMessage(message) {
        this.buildMessage = jest.fn(() => message)
    }
}
