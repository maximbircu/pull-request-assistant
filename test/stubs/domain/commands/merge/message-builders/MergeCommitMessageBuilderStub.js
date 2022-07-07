export class MergeCommitMessageBuilderStub {
    buildMessage = jest.fn()

    enqueueMessage(message) {
        this.buildMessage = jest.fn(() => message)
    }
}
