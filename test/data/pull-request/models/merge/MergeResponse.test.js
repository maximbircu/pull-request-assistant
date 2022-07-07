import { MergeResponse } from '../../../../../src/data/pull-request/models/merge/MergeResponse'

test('creates a proper merge response from raw data', () => {
    expect(MergeResponse.createFromRawData(
        {
            sha: '123ab32',
            merged: true
        }
    )).toStrictEqual(new MergeResponse('123ab32', true))
})
