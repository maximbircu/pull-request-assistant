import { Comment } from '../../../../src/data/comments/models/Comment'

test('creates a proper Comment object from raw data', () => {
    expect(
        Comment.createFromRawData(
            {
                user: { login: 'bob' },
                body: 'comment text',
                id: '123ab32'
            }
        )
    ).toStrictEqual(new Comment('bob', 'comment text', '123ab32'))
})
