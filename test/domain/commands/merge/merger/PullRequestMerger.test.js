import {
    PullRequestMerger
} from '../../../../../src/domain/commands/merge/merger/PullRequestMerger'

test('throws type error when trying to intialise', () => {
    expect(() => {
        new PullRequestMerger()
    }).toThrow(new TypeError('Cannot construct an abstract instances!'))
})
