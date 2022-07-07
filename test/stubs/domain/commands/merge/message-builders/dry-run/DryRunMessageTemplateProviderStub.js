import { FileReader } from '../../../../../../../src/infrastructure/utils/FileReader'

export class DryRunMessageTemplateProviderStub {
    #fileUtils = new FileReader()

    dryRunTemplate() {
        return this.#fileUtils.readFileSync(
            `./assets/commands/merge/dry-run-template.txt`
        )
    }

    dryRunRebaseTemplate() {
        return this.#fileUtils.readFileSync(
            `./assets/commands/merge/dry-run-rebase-template.txt`
        )
    }
}
