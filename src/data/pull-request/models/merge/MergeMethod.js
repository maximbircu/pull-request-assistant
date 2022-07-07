export class MergeMethod {
    static MERGE = 'merge'
    static SQUASH = 'squash'
    static REBASE = 'rebase'

    static mergeMethods = [MergeMethod.MERGE, MergeMethod.SQUASH, MergeMethod.REBASE]

    static getMethodFromText(mergeMethodText) {
        return this.mergeMethods.find((method) => method === mergeMethodText)
    }
}
