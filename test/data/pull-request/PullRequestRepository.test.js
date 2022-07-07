import { PullRequestRepository } from '../../../src/data/pull-request/PullRequestRepository'
import { OctokitStub } from '../../stubs/data/OctokitStub'
import { Commit } from '../../../src/data/pull-request/models/Commit'
import { Logger } from '../../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../src/infrastructure/utils/ConsolePrinter'
import { ReviewState } from '../../../src/data/pull-request/models/review/ReviewState'
import { PullRequestReview } from '../../../src/data/pull-request/models/review/PullRequestReview'
import { MergeMethod } from '../../../src/data/pull-request/models/merge/MergeMethod'
import { MergeResponse } from '../../../src/data/pull-request/models/merge/MergeResponse'
import { CheckRunStatus } from '../../../src/data/pull-request/models/check-run/CheckRunStatus'
import {
    CheckRunConclusion
} from '../../../src/data/pull-request/models/check-run/CheckRunConclusion'
import { CheckRun } from '../../../src/data/pull-request/models/check-run/CheckRun'
import { PullRequest } from '../../../src/data/pull-request/models/PullRequest'
import { GithubContextStub } from '../../stubs/data/GithubContextStub'

jest.mock('../../../src/infrastructure/logging/Logger')

const octokitStub = new OctokitStub()
const repository = new PullRequestRepository(octokitStub, new GithubContextStub())

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
})

test('fetches current pull request', async () => {
    const response = {
        title: 'Pull Request Title',
        number: 3,
        mergeable: true,
        rebaseable: true,
        head: {
            sha: '123ba32',
            repo: {
                name: 'pull-request-assistant',
                full_name: 'https://pull-request-assistant'
            },
            ref: 'head/ref'
        },
        base: { ref: 'base/ref' },
        body: 'pr description'
    }
    octokitStub.enqueuePullRequest(response)

    const reviews = await repository.getCurrentBuildPullRequest()

    expect(octokitStub.rest.pulls.get).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Pull Request', response)
    expect(reviews).toStrictEqual(PullRequest.createFromRawData(response))
})

test('fetches pull request', async () => {
    const response = {
        title: 'Pull Request Title',
        number: 3,
        mergeable: true,
        rebaseable: true,
        head: {
            sha: '123ba32',
            repo: {
                name: 'pull-request-assistant',
                full_name: 'https://pull-request-assistant'
            },
            ref: 'head/ref'
        },
        base: { ref: 'base/ref' },
        body: 'pr description'
    }
    octokitStub.enqueuePullRequest(response)

    const reviews = await repository.getPullRequest(3)

    expect(octokitStub.rest.pulls.get).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Pull Request', response)
    expect(reviews).toStrictEqual(PullRequest.createFromRawData(response))
})

test('fetches checks', async () => {
    const reviewsResponse = {
        check_runs: [
            {
                name: 'pull-request-assistant',
                status: CheckRunStatus.COMPLETED,
                conclusion: CheckRunConclusion.SUCCESS
            },
            {
                name: 'pull-request-assistant',
                status: CheckRunStatus.COMPLETED,
                conclusion: CheckRunConclusion.FAILED
            }
        ]
    }
    octokitStub.enqueueChecks(reviewsResponse)

    const reviews = await repository.getChecks({ headSha: '123ab32' })

    expect(octokitStub.rest.checks.listForRef).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        ref: '123ab32'
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Checks', reviewsResponse)
    expect(reviews).toStrictEqual([
        new CheckRun('pull-request-assistant', CheckRunStatus.COMPLETED, CheckRunConclusion.SUCCESS),
        new CheckRun('pull-request-assistant', CheckRunStatus.COMPLETED, CheckRunConclusion.FAILED)
    ])
})

test('merges and rebase pull request', async () => {
    const pullRequest = { number: 3, title: 'Pull request title' }
    const rawMergeResponse = { sha: '123ab32', merged: true }
    octokitStub.enqueueMergeResponse(rawMergeResponse)

    await repository.mergePullRequest(pullRequest, MergeMethod.REBASE, 'commit message')

    expect(octokitStub.rest.pulls.merge).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3,
        merge_method: MergeMethod.REBASE
    })
})

test('merges pull request', async () => {
    const pullRequest = { number: 3, title: 'Pull request title' }
    const rawMergeResponse = { sha: '123ab32', merged: true }
    octokitStub.enqueueMergeResponse(rawMergeResponse)

    await repository.mergePullRequest(pullRequest, MergeMethod.MERGE, 'commit message')

    expect(octokitStub.rest.pulls.merge).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3,
        commit_title: 'Pull request title',
        commit_message: 'commit message',
        merge_method: MergeMethod.MERGE
    })
})

test('throws', async () => {
    await expect(
        repository.merge(expect.any(Object), MergeMethod.REBASE, expect.any(String))
    ).rejects.toThrow(`Use ${MergeMethod.REBASE} for a rebase merge`)
})

test('merges the pull request', async () => {
    const rawMergeResponse = { sha: '123ab32', merged: true }
    octokitStub.enqueueMergeResponse(rawMergeResponse)

    const mergeResponse = await repository.merge(
        { number: 3, title: 'pull request title' },
        MergeMethod.MERGE,
        'commit message'
    )

    expect(octokitStub.rest.pulls.merge).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3,
        commit_title: 'pull request title',
        commit_message: 'commit message',
        merge_method: MergeMethod.MERGE
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Merge Pull Request', rawMergeResponse)
    expect(mergeResponse).toStrictEqual(new MergeResponse('123ab32', true))
})

test('merges and rebase the pull request', async () => {
    const rawMergeResponse = { sha: '123ab32', merged: true }
    octokitStub.enqueueMergeResponse(rawMergeResponse)

    const mergeResponse = await repository.mergeAndRebase({ number: 3 })

    expect(octokitStub.rest.pulls.merge).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3,
        merge_method: MergeMethod.REBASE
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Merge Pull Request', rawMergeResponse)
    expect(mergeResponse).toStrictEqual(new MergeResponse('123ab32', true))
})

test('fetches reviews', async () => {
    const reviewsResponse = [
        { user: { login: 'a' }, state: ReviewState.APPROVED, submitted_at: '2022-05-28T17:59:10Z' },
        { user: { login: 'b' }, state: ReviewState.DISMISSED, submitted_at: '2022-05-28T17:40:10Z' }
    ]
    octokitStub.enqueueReviews(reviewsResponse)

    const reviews = await repository.getReviews(3)

    expect(octokitStub.rest.pulls.listReviews).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Reviews', reviewsResponse)
    expect(reviews).toStrictEqual([
        new PullRequestReview('a', ReviewState.APPROVED, '2022-05-28T17:59:10Z'),
        new PullRequestReview('b', ReviewState.DISMISSED, '2022-05-28T17:40:10Z')
    ])
})

test('fetches commits', async () => {
    const commitsResponse = [
        { sha: '12ab32', commit: { message: 'Initial commit' } },
        { sha: '13bc12', commit: { message: 'Adjust readme file' } }
    ]
    octokitStub.enqueueCommits(commitsResponse)

    const commits = await repository.getCommits(3)

    expect(octokitStub.rest.pulls.listCommits).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        pull_number: 3
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Commits', commitsResponse)
    expect(commits).toStrictEqual([
        new Commit('12ab32', 'Initial commit'),
        new Commit('13bc12', 'Adjust readme file')
    ])
})

describe('parses properly the PR number from payload', () => {
    test('parses PR number directly from payload object', () => {
        const repository = new PullRequestRepository(new OctokitStub(), { payload: { number: 3 } })

        expect(repository.currentBuildPrNumber).toBe(3)
    })

    test('parses PR number from issue object', () => {
        const repository = new PullRequestRepository(
            new OctokitStub(),
            { payload: { issue: { number: 3 } } }
        )

        expect(repository.currentBuildPrNumber).toBe(3)
    })

    test('parses PR number from pll request object', () => {
        const repository = new PullRequestRepository(
            new OctokitStub(),
            { payload: { pull_request: { number: 3 } } }
        )

        expect(repository.currentBuildPrNumber).toBe(3)
    })

    test('returns undefined in case the PR number is not present', () => {
        const repository = new PullRequestRepository(new OctokitStub(), { payload: {} })

        expect(repository.currentBuildPrNumber).toBeNull()
    })
})
