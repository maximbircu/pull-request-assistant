import { PullRequestRepositoryStub } from '../../../stubs/data/pull-requests/PullRequestRepositoryStub'
import { ReviewersProviderStub } from '../../../stubs/domain/commands/merge/ReviewersProviderStub'
import { MergeabilityProvider } from '../../../../src/domain/commands/merge/MergeabilityProvider'
import { CheckRun } from '../../../../src/data/pull-request/models/check-run/CheckRun'
import { CheckRunStatus } from '../../../../src/data/pull-request/models/check-run/CheckRunStatus'
import { CheckRunConclusion } from '../../../../src/data/pull-request/models/check-run/CheckRunConclusion'

const pullRequestRepositoryStub = new PullRequestRepositoryStub()
const reviewersProviderStub = new ReviewersProviderStub()

test('returns proper mergeability when the approves are not sufficient', async () => {
    reviewersProviderStub.enqueueReviewers(['bob', 'max'])
    pullRequestRepositoryStub.enqueueChecks([new CheckRun('CI', CheckRunStatus.RUNNING, null)])
    const provider = new MergeabilityProvider(
        pullRequestRepositoryStub,
        reviewersProviderStub,
        { job: 'pull-request-assistant' },
        { 
            requiredNumberOfApprovals: 3,
            requiredChecks: ['CI']
        }
    )

    expect(await provider.getMergeability({}))
        .toEqual({ mergeable: false, reason: 'Doesn\'t have enough approves!' })
})

test('returns proper mergeability when not all required checks passed', async () => {
    reviewersProviderStub.enqueueReviewers(['bob', 'max'])
    pullRequestRepositoryStub.enqueueChecks([new CheckRun('CI', CheckRunStatus.RUNNING, null)])
    const provider = new MergeabilityProvider(
        pullRequestRepositoryStub,
        reviewersProviderStub,
        { job: 'pull-request-assistant' },
        { 
            requiredNumberOfApprovals: 2,
            requiredChecks: ['CI']
        }
    )

    expect(await provider.getMergeability({}))
        .toEqual({ mergeable: false, reason: 'Not all the checks passed' })
})

test('returns proper mergeability when not all required checks passed', async () => {
    reviewersProviderStub.enqueueReviewers(['bob', 'max'])
    pullRequestRepositoryStub.enqueueChecks(
        [new CheckRun('CI', CheckRunStatus.COMPLETED, CheckRunConclusion.SUCCESS)]
    )
    const provider = new MergeabilityProvider(
        pullRequestRepositoryStub,
        reviewersProviderStub,
        { job: 'pull-request-assistant' },
        { 
            requiredNumberOfApprovals: 2,
            requiredChecks: ['CI']
        }
    )

    expect(await provider.getMergeability({ isMergeable: false })).toEqual(
        {
            mergeable: false,
            reason: 'There is something wrong with mergeability, are there any conflicts?'
        }
    )
})

test('returns true even if non-required checks did not succeed', async () => {
    reviewersProviderStub.enqueueReviewers(['bob', 'max'])
    pullRequestRepositoryStub.enqueueChecks(
        [new CheckRun('CI', CheckRunStatus.COMPLETED, CheckRunConclusion.SUCCESS)],
        [new CheckRun('CI2', CheckRunStatus.RUNNING, null)]
    )
    const provider = new MergeabilityProvider(
        pullRequestRepositoryStub,
        reviewersProviderStub,
        { job: 'pull-request-assistant' },
        { 
            requiredNumberOfApprovals: 2,
            requiredChecks: ['CI']
        }
    )

    expect(await provider.getMergeability({ isMergeable: true }))
        .toEqual({ mergeable: true, reason: null })
})

test('returns proper mergeability when the PR is mergeable', async () => {
    reviewersProviderStub.enqueueReviewers(['bob', 'max'])
    pullRequestRepositoryStub.enqueueChecks(
        [new CheckRun('CI', CheckRunStatus.COMPLETED, CheckRunConclusion.SUCCESS)]
    )
    const provider = new MergeabilityProvider(
        pullRequestRepositoryStub,
        reviewersProviderStub,
        { job: 'pull-request-assistant' },
        { 
            requiredNumberOfApprovals: 2,
            requiredChecks: ['CI']
        }
    )

    expect(await provider.getMergeability({ isMergeable: true }))
        .toEqual({ mergeable: true, reason: null })
})
