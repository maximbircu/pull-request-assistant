export class MergeCommitMessageTemplateProvider {
    #config
    #fileReader

    constructor(config, fileReader) {
        this.#config = config
        this.#fileReader = fileReader
    }

    readTemplate() {
        let templatePath = this.#config.commitMessageTemplatePath
        if (templatePath === '/assets/commands/merge/commit-template.txt') {
            templatePath = `${this.#fileReader.dirName}${templatePath}`
        }
        if (!this.#fileReader.fileExists(templatePath)) {
            throw Error(`The provided "commit_message_template_path:${templatePath}" doesn't exist`)
        }
        return this.#fileReader.readFileSync(templatePath)
    }
}
