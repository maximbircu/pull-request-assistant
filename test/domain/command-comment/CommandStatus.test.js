import { RunLinkProvider } from '../../../src/infrastructure/utils/RunLinkProvider'
import { CommandStatus } from '../../../src/domain/command-comment/CommandStatus'

beforeEach(() => {
    RunLinkProvider.linkToRun = 'https://github.com/maximbircu/actions/runs/2'
})

describe('returns proper status text from a text containing a status text', () => {
    test('returns proper status text for PENDING status text', () => {
        const text = '**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟡'

        expect(CommandStatus.getStatusTextFromText(text)).toBe(text)
    })

    test('returns proper status text for EXECUTED status text', () => {
        const text = '**Executed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟢'

        expect(CommandStatus.getStatusTextFromText(text)).toBe(text)
    })

    test('returns proper status text for FAILED status text', () => {
        const text = '**Failed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🔴'

        expect(CommandStatus.getStatusTextFromText(text)).toBe(text)
    })

    test('returns proper status text for CANCELLED status text', () => {
        const text = '**Canceled** [_(details)_](https://github.com/maximbircu/actions/runs/2) ❌'

        expect(CommandStatus.getStatusTextFromText(text)).toBe(text)
    })

    test('returns proper status text for UNDEFINED status text', () => {
        expect(CommandStatus.getStatusTextFromText('')).toBe(null)
    })
})

describe('returns proper status from text', () => {
    test('returns proper status for PENDING status text', () => {
        const text = '**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟡'

        expect(CommandStatus.getStatusFromText(text)).toBe(CommandStatus.PENDING)
    })

    test('returns proper status for EXECUTED status text', () => {
        const text = '**Executed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟢'

        expect(CommandStatus.getStatusFromText(text)).toBe(CommandStatus.EXECUTED)
    })

    test('returns proper status for FAILED status text', () => {
        const text = '**Failed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🔴'

        expect(CommandStatus.getStatusFromText(text)).toBe(CommandStatus.FAILED)
    })

    test('returns proper status for CANCELLED status text', () => {
        const text = '**Canceled** [_(details)_](https://github.com/maximbircu/actions/runs/2) ❌'

        expect(CommandStatus.getStatusFromText(text)).toBe(CommandStatus.CANCELLED)
    })

    test('returns proper status for UNDEFINED status text', () => {
        expect(CommandStatus.getStatusFromText('')).toBe(CommandStatus.UNDEFINED)
    })
})

describe('returns proper status text', () => {
    test('returns proper text for PENDING status', () => {
        expect(CommandStatus.getStatusText(CommandStatus.PENDING))
            .toBe('**Pending** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟡')
    })

    test('returns proper text for EXECUTED status', () => {
        expect(CommandStatus.getStatusText(CommandStatus.EXECUTED))
            .toBe('**Executed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🟢')
    })

    test('returns proper text for FAILED status', () => {
        expect(CommandStatus.getStatusText(CommandStatus.FAILED))
            .toBe('**Failed** [_(details)_](https://github.com/maximbircu/actions/runs/2) 🔴')
    })

    test('returns proper text for CANCELLED status', () => {
        expect(CommandStatus.getStatusText(CommandStatus.CANCELLED))
            .toBe('**Canceled** [_(details)_](https://github.com/maximbircu/actions/runs/2) ❌')
    })

    test('returns proper text for UNDEFINED status', () => {
        expect(CommandStatus.getStatusText(CommandStatus.UNDEFINED))
            .toBe('')
    })
})
