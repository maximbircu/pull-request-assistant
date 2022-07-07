export class DryRunMessageTemplateProvider {
    #fileReader

    constructor(fileReader) {
        this.#fileReader = fileReader
    }

    dryRunTemplate() {
        return this.#fileReader.readFileSync(`${this.#fileReader.dirName}/assets/commands/merge/dry-run-template.txt`)
    }

    dryRunRebaseTemplate() {
        return this.#fileReader.readFileSync(
            `${this.#fileReader.dirName}/assets/commands/merge/dry-run-rebase-template.txt`
        )
    }
}
