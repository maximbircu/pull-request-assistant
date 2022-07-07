import { CommandCommentParser } from '../../../src/domain/command-comment/CommandCommentParser'
import { CommandStatus } from '../../../src/domain/command-comment/CommandStatus'
import { RunLinkProvider } from '../../../src/infrastructure/utils/RunLinkProvider'

test('parses the command comment text properly', () => {
    const parser = new CommandCommentParser(
        { assistantName: 'friday' },
        'friday -h\n' +
        '\n' +
        'body\n' +
        '\n' +
        '**Executed** [_(details)_]' +
        '(https://github.com/maximbircu/pr-auto-merge-playground/actions/runs/2353615949) 🟢'
    )

    expect(parser.command).toBe('friday -h')
    expect(parser.body).toBe('body')
    expect(parser.status).toBe(CommandStatus.EXECUTED)
})

test('updates the command comment body properly', () => {
    RunLinkProvider.linkToRun =
        'https://github.com/maximbircu/pr-auto-merge-playground/actions/runs/2353615949'
    const parser = new CommandCommentParser(
        { assistantName: 'friday' },
        'friday -h\n' +
        '\n' +
        'body\n' +
        '\n' +
        '**Executed** [_(details)_]' +
        '(https://github.com/maximbircu/pr-auto-merge-playground/actions/runs/2353615949) 🟢'
    )

    parser.body = 'new body'
    parser.status = CommandStatus.FAILED

    expect(parser.comment).toBe(
        'friday -h\n' +
        '\n' +
        'new body\n' +
        '\n' +
        '**Failed** [_(details)_]' +
        '(https://github.com/maximbircu/pr-auto-merge-playground/actions/runs/2353615949) 🔴'
    )
})
