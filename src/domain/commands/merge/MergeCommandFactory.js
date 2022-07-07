import { MergeCommand } from './MergeCommand'
import { MergeCommitMessageBuilder } from './message-builders/MergeCommitMessageBuilder'
import { DryRunMessageBuilder } from './message-builders/dry-run/DryRunMessageBuilder'
import { ReviewersProvider } from './ReviewersProvider'
import { MergeabilityProvider } from './MergeabilityProvider'
import {
    DryRunMessageTemplateProvider
} from './message-builders/dry-run/DryRunMessageTemplateProvider'
import { FileReader } from '../../../infrastructure/utils/FileReader'
import { PullRequestMergerFactory } from './merger/PullRequestMergerFactory'
import {
    MergeCommitMessageTemplateProvider
} from './message-builders/MergeCommitMessageTemplateProvider'

export class MergeCommandFactory {
    #dataModule
    #domainModule

    constructor(dataModule, domainModule) {
        this.#dataModule = dataModule
        this.#domainModule = domainModule
    }

    create() {
        const pullRequestRepository = this.#dataModule.pullRequestRepository
        const config = this.#domainModule.config.commands.merge
        const reviewersProvider = new ReviewersProvider(pullRequestRepository)

        return new MergeCommand(
            config,
            pullRequestRepository,
            new MergeCommitMessageBuilder(
                pullRequestRepository,
                reviewersProvider,
                new MergeCommitMessageTemplateProvider(config, new FileReader()),
                config
            ),
            new PullRequestMergerFactory(
                new DryRunMessageBuilder(
                    reviewersProvider,
                    pullRequestRepository,
                    new DryRunMessageTemplateProvider(new FileReader())
                ),
                pullRequestRepository
            ),
            this.#domainModule.commandCommentController,
            new MergeabilityProvider(
                pullRequestRepository,
                reviewersProvider,
                this.#dataModule.githubContext,
                config
            )
        )
    }
}
