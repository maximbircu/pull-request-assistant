import {
    DryRunMessageBuilder
} from '../../../../../../src/domain/commands/merge/message-builders/dry-run/DryRunMessageBuilder'
import {
    ReviewersProviderStub
} from '../../../../../stubs/domain/commands/merge/ReviewersProviderStub'
import { PullRequestRepositoryStub } from '../../../../../stubs/data/pull-requests/PullRequestRepositoryStub'
import {
    DryRunMessageTemplateProviderStub
} from '../../../../../stubs/domain/commands/merge/message-builders/dry-run/DryRunMessageTemplateProviderStub'
import { Commit } from '../../../../../../src/data/pull-request/models/Commit'
import { MergeMethod } from '../../../../../../src/data/pull-request/models/merge/MergeMethod'

const reviewersProviderStub = new ReviewersProviderStub()
const pullRequestRepositoryStub = new PullRequestRepositoryStub()
const dryRunMessageTemplateProviderStub = new DryRunMessageTemplateProviderStub()
const messageBuilder = new DryRunMessageBuilder(
    reviewersProviderStub,
    pullRequestRepositoryStub,
    dryRunMessageTemplateProviderStub
)

test('creates dry run message for merge', async () => {
    reviewersProviderStub.enqueueReviewers(['max', 'bob'])
    pullRequestRepositoryStub.enqueueCommits(
        [
            new Commit('12ab32as45', 'Commit 1'),
            new Commit('23sd34as12', 'Commit 2')
        ]
    )

    const message = await messageBuilder.buildMessage(
        { title: 'Pull request title' },
        'Merge commit message',
        false,
        MergeMethod.MERGE
    )

    expect(message).toBe(
        'Mergeable - ❌\n' +
        'Method \t  - merge\n' +
        'Reviewers - max,bob\n' +
        '\n' +
        'Message\n' +
        '\n' +
        '\tPull request title\n' +
        '\n' +
        '\tMerge commit message\n' +
        '\n' +
        'Commits\n' +
        '\n' +
        '\t| 12ab32a | Commit 1\n' +
        '\t| 23sd34a | Commit 2'
    )
})

test('creates dry run message for rebase', async () => {
    reviewersProviderStub.enqueueReviewers(['max', 'bob'])
    pullRequestRepositoryStub.enqueueCommits(
        [
            new Commit('12ab32as45', 'Commit 1'),
            new Commit('23sd34as12', 'Commit 2')
        ]
    )

    const message = await messageBuilder.buildMessage(
        { title: 'Pull request title' },
        'Merge commit message',
        false,
        MergeMethod.REBASE
    )

    expect(message).toBe(
        'Mergeable - ❌\n' +
        'Method \t  - rebase\n' +
        'Reviewers - max,bob\n' +
        '\n' +
        'Commits\n' +
        '\n' +
        '\t| 12ab32a | Commit 1\n' +
        '\t| 23sd34a | Commit 2'
    )
})

