import { CheckRunStatus } from './CheckRunStatus'
import { CheckRunConclusion } from './CheckRunConclusion'

export class CheckRun {
    #name
    #status
    #conclusion

    constructor(name, status, conclusion) {
        this.#name = name
        this.#status = status
        this.#conclusion = conclusion
    }

    static createFromRawData(rawCheck) {
        return new CheckRun(rawCheck.name, rawCheck.status, rawCheck.conclusion)
    }

    get name() {
        return this.#name
    }

    get status() {
        return this.#status
    }

    get conclusion() {
        return this.#conclusion
    }

    get isCompletedSuccessfully() {
        return this.#status === CheckRunStatus.COMPLETED &&
            this.#conclusion === CheckRunConclusion.SUCCESS
    }
}
