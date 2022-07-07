import { PullRequestRepository } from '../data/pull-request/PullRequestRepository'
import { CommentsRepository } from '../data/comments/CommentsRepository'

const github = require('@actions/github')
const { Octokit } = require('@octokit/action')
const process = require('process')

export class DataModule {
    #octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

    constructor() {
        this._pullRequestRepository = new PullRequestRepository(this.#octokit, github.context)
        this._commentsRepository = new CommentsRepository(this.#octokit, github.context)
    }

    get pullRequestRepository() {
        return this._pullRequestRepository
    }

    get commentsRepository() {
        return this._commentsRepository
    }

    get githubContext() {
        return github.context
    }
}
