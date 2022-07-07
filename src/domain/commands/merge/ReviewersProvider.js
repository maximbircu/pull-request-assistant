import { CollectionUtils } from '../../../infrastructure/utils/CollectionUtils'
import { ReviewState } from '../../../data/pull-request/models/review/ReviewState'

export class ReviewersProvider {
    #pullRequestRepository

    constructor(pullRequestRepository) {
        this.#pullRequestRepository = pullRequestRepository
    }

    async getReviewers(pullRequest) {
        const reviews = await this.getLatestReviews(pullRequest)
        return reviews.filter((review) => review.state === ReviewState.APPROVED)
            .map((review) => review.user)
    }

    async getLatestReviews(pullRequest) {
        const allReviews = await this.#pullRequestRepository.getReviews(pullRequest.number)
        return Object.values(CollectionUtils.groupBy(allReviews, 'user'))
            .map((reviews) => {
                return reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
            })
    }
}
