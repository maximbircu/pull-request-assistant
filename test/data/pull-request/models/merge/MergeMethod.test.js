import { MergeMethod } from '../../../../../src/data/pull-request/models/merge/MergeMethod'

test('returns a proper merge method give name', () => {
    MergeMethod.mergeMethods.forEach((method) => {
        expect(MergeMethod.getMethodFromText(method)).toBe(method)
    })
})

test('returns null if the merge method is not supported', () => {
    expect(MergeMethod.getMethodFromText('inexistent')).toBeUndefined()
})

