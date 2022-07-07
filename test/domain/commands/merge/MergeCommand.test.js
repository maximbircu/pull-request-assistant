import { PullRequestRepositoryStub } from '../../../stubs/data/pull-requests/PullRequestRepositoryStub'
import {
    MergeCommitMessageBuilderStub
} from '../../../stubs/domain/commands/merge/message-builders/MergeCommitMessageBuilderStub'
import { CommandCommentControllerStub } from '../../../stubs/domain/command-comment/CommandCommentControllerStub'
import { MergeabilityProviderStub } from '../../../stubs/domain/commands/merge/MergeabilityProviderStub'
import { MergeCommand } from '../../../../src/domain/commands/merge/MergeCommand'
import { CommandBuilderStub } from '../../../stubs/domain/CommandBuilderStub'
import { PullRequestMergerFactoryStub } from '../../../stubs/domain/commands/merge/merger/PullRequestMergerFactoryStub'
import { PullRequestMergerStub } from '../../../stubs/domain/commands/merge/merger/PullRequestMergerStub'

const pullRequestRepositoryStub = new PullRequestRepositoryStub()
const mergeCommitMessageBuilderStub = new MergeCommitMessageBuilderStub()

const pullRequestMergerFactoryStub = new PullRequestMergerFactoryStub()
const pullRequestMergerStub = new PullRequestMergerStub()
pullRequestMergerFactoryStub.enqueueMerger(pullRequestMergerStub)

const commandCommentControllerStub = new CommandCommentControllerStub()
const mergeabilityProviderStub = new MergeabilityProviderStub()
const commandBuilderStub = CommandBuilderStub.createAndSet()

const command = new MergeCommand(
    { defaultMergeMethod: 'squash' },
    pullRequestRepositoryStub,
    mergeCommitMessageBuilderStub,
    pullRequestMergerFactoryStub,
    commandCommentControllerStub,
    mergeabilityProviderStub
)

test('configures the merge command properly', () => {
    expect(commandBuilderStub.option)
        .toBeCalledWith('-d, --dry-run', 'Runs the command but doesn\'t execute any action.')

    expect(commandBuilderStub.option)
        .toBeCalledWith(
            '--merge-method <METHOD>',
            'The merge method to be used when merging the Pull Request. (merge/squash/rebase)',
            'squash'
        )
})

test('executes a merge properly', async () => {
    const pullRequest = {}
    const message = ''
    pullRequestRepositoryStub.enqueueCurrentBuildPullRequest(pullRequest)
    mergeCommitMessageBuilderStub.enqueueMessage(message)
    mergeabilityProviderStub.enqueueMergeability(true)
    await command.execute({ dryRun: true, mergeMethod: 'squash' })

    expect(pullRequestMergerStub.run).toBeCalledWith(
        pullRequest,
        'squash',
        message,
        true,
        commandCommentControllerStub.activeCommandComment
    )
    expect(pullRequestMergerFactoryStub.create).toBeCalledWith(true)
})
