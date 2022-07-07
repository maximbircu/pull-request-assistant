import { PullRequestRepository } from '../../../../src/data/pull-request/PullRequestRepository'
import { ReviewersProvider } from '../../../../src/domain/commands/merge/ReviewersProvider'
import {
    PullRequestReview
} from '../../../../src/data/pull-request/models/review/PullRequestReview'
import { ReviewState } from '../../../../src/data/pull-request/models/review/ReviewState'


test('provides a proper list of reviewers', async () => {
    mockRepository([
        new PullRequestReview('max', ReviewState.DISMISSED, '2022-05-28T17:59:10Z'),
        new PullRequestReview('max', ReviewState.APPROVED, '2022-05-28T17:40:10Z'),
        new PullRequestReview('bred', ReviewState.APPROVED, '2022-05-28T17:40:10Z'),
        new PullRequestReview('bob', ReviewState.APPROVED, '2022-05-28T17:40:10Z')
    ])
    const provider = new ReviewersProvider(new PullRequestRepository())

    const reviews = await provider.getReviewers({})
    expect(reviews).toEqual(['bred', 'bob'])
})

jest.mock( '../../../../src/data/pull-request/PullRequestRepository')
const mockRepository = (reviews) => {
    PullRequestRepository.mockImplementation(() => {
        return { getReviews: () => reviews }
    })
}
