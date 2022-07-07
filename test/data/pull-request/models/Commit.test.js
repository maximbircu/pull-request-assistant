import { Commit } from '../../../../src/data/pull-request/models/Commit'

test('creates a proper commit object from raw data', () => {
    expect(
        Commit.createFromRawData({ sha: '123ab32', commit: { message: 'commit message' } })
    ).toStrictEqual(new Commit(`123ab32`, 'commit message'))
})
