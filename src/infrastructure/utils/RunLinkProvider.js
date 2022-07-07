const process = require('process')

export class RunLinkProvider {
    static #linkToRepo = `https://github.com/${process.env.GITHUB_REPOSITORY}`
    static linkToRun = this.#linkToRepo + `/actions/runs/${process.env.GITHUB_RUN_ID}`
}
