import {
    PullRequestReview
} from '../../../../../src/data/pull-request/models/review/PullRequestReview'

test('creates a PullRequestReview from raw data', () => {
    expect(PullRequestReview.createFromRawData(
        {
            user: { login: 'bob' },
            state: 'APPROVED',
            submitted_at: '2022-05-28T17:59:10Z'
        }
    )).toStrictEqual(new PullRequestReview('bob', 'APPROVED', '2022-05-28T17:59:10Z'))
})
