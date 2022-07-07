import { PullRequestMergerFactory } from '../../../../../src/domain/commands/merge/merger/PullRequestMergerFactory'
import { PullRequestMergerImpl } from '../../../../../src/domain/commands/merge/merger/PullRequestMergerImpl'
import { DryRunPullRequestMerger } from '../../../../../src/domain/commands/merge/merger/DryRunPullRequestMerger'
import {
    DryRunMessageBuilderStub
} from '../../../../stubs/domain/commands/merge/message-builders/dry-run/DryRunMessageBuilderStub'
import { PullRequestRepositoryStub } from '../../../../stubs/data/pull-requests/PullRequestRepositoryStub'

const messageBuilderStub = new DryRunMessageBuilderStub()
const pullRequestRepositoryStub = new PullRequestRepositoryStub()

test('creates a pull request merger', () => {
    const factory = new PullRequestMergerFactory(messageBuilderStub, pullRequestRepositoryStub)

    const merger = factory.create(false)

    expect(merger).toBeInstanceOf(PullRequestMergerImpl)
})

test('creates a dry-run pull request merger', () => {
    const factory = new PullRequestMergerFactory(messageBuilderStub, pullRequestRepositoryStub)

    const merger = factory.create(true)

    expect(merger).toBeInstanceOf(DryRunPullRequestMerger)
})
