export class CommandBuilderProvider {
    static #programInstance

    static init(program) {
        this.#programInstance = program
    }

    static get builder() {
        return this.#programInstance
    }
}
