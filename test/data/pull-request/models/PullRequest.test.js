import { PullRequest } from '../../../../src/data/pull-request/models/PullRequest'

test('creates a proper Pull Request object from raw data', () => {
    expect(
        PullRequest.createFromRawData(
            {
                title: 'PR title',
                number: 1,
                mergeable: true,
                rebaseable: true,
                head: {
                    sha: '123ab32',
                    ref: 'feature',
                    repo: {
                        name: 'pull-request-assistant',
                        full_name: `https://github.com/maximbircu/pull-request-assistant-`
                    }
                },
                base: { ref: 'master' },
                body: 'PR description'

            }
        )
    ).toStrictEqual(new PullRequest(
        'PR title',
        1,
        true,
        true,
        'pull-request-assistant',
        'feature',
        'master',
        'PR description',
        `https://github.com/maximbircu/pull-request-assistant-`,
        `123ab32`
    ))
})
