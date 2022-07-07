import { Assistant } from '../domain/Assistant'
import { CommandCommentController } from '../domain/command-comment/CommandCommentController'
import { MergeCommandFactory } from '../domain/commands/merge/MergeCommandFactory'

const process = require('process')

export class DomainModule {
    constructor(dataModule, configProvider) {
        this._config = configProvider.config
        this._commandCommentController = new CommandCommentController(this._config, dataModule.commentsRepository)

        const commands = [
            new MergeCommandFactory(dataModule, this).create()
        ]

        this._assistant = new Assistant(
            commands,
            this._commandCommentController,
            dataModule.pullRequestRepository,
            configProvider,
            process
        )
    }

    get config() {
        return this._config
    }

    get commandCommentController() {
        return this._commandCommentController
    }

    get assistant() {
        return this._assistant
    }
}
