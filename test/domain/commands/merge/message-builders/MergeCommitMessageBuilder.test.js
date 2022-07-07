import { PullRequestRepositoryStub } from '../../../../stubs/data/pull-requests/PullRequestRepositoryStub'
import { ReviewersProviderStub } from '../../../../stubs/domain/commands/merge/ReviewersProviderStub'
import {
    MergeCommitMessageBuilder
} from '../../../../../src/domain/commands/merge/message-builders/MergeCommitMessageBuilder'
import {
    MergeCommitMessageTemplateProviderStub
} from '../../../../stubs/domain/commands/merge/message-builders/MergeCommitMessageTemplateProviderStub'

const pullRequestRepositoryStub = new PullRequestRepositoryStub()
const reviewsProvider = new ReviewersProviderStub()
const mergeCommitMessageTemplateProviderStub = new MergeCommitMessageTemplateProviderStub()

const createMessageBuilder = (config) => new MergeCommitMessageBuilder(
    pullRequestRepositoryStub,
    reviewsProvider,
    mergeCommitMessageTemplateProviderStub,
    config
)

test('generates a proper commit message using title as description', async () => {
    reviewsProvider.enqueueReviewers(['bob', 'max'])
    const messageBuilder = createMessageBuilder(
        {
            issueIdProvider: () => 123,
            reviewersProvider: (reviewers) => reviewers.join(','),
            commitMessageTemplatePath: '/assets/commands/merge/commit-template.txt'
        }
    )

    const message = await messageBuilder.buildMessage({
        number: 3,
        title: 'Pull request title'
    })

    expect(message).toBe(
        'Issue: 123\n' +
        'Reviewers: bob,max\n' +
        'PR: GH-3\n\n' +
        'Pull request title'
    )
})

test('generates a proper commit message using description provider', async () => {
    reviewsProvider.enqueueReviewers(['bob', 'max'])
    const messageBuilder = createMessageBuilder(
        {
            issueIdProvider: () => 123,
            commitMessageTemplatePath: '/assets/commands/merge/commit-template.txt',
            descriptionProvider: () => 'Commit message description'
        }
    )

    const message = await messageBuilder.buildMessage({
        number: 3,
        title: 'Pull request title'
    })

    expect(message).toBe(
        'Issue: 123\n' +
        'Reviewers: bob max\n' +
        'PR: GH-3\n\n' +
        'Commit message description'
    )
})
