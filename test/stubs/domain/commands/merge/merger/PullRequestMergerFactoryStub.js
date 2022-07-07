export class PullRequestMergerFactoryStub {
    create = jest.fn()

    enqueueMerger(merger) {
        this.create = jest.fn(() => merger)
    }
}
