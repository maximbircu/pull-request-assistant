export class ReviewersProviderStub {
    getReviewers = jest.fn()

    enqueueReviewers(reviewers) {
        this.getReviewers = jest.fn(() => reviewers)
    }
}
