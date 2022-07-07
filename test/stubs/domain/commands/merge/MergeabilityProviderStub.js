export class MergeabilityProviderStub {
    getMergeability = jest.fn()

    enqueueMergeability(mergeability) {
        this.getMergeability = jest.fn(() => mergeability)
    }
}
