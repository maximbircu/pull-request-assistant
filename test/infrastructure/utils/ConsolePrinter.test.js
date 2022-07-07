const core = require('@actions/core')
const { ConsolePrinter } = require('../../../src/infrastructure/utils/ConsolePrinter')

jest.mock('@actions/core')
jest.unmock('../../../src/infrastructure/utils/ConsolePrinter')

test('prints properly', () => {
    const printer = new ConsolePrinter()
    console.log = jest.fn()

    printer.print('message')

    expect(console.log).toHaveBeenCalledWith('message')
})


test('prints collapsible', () => {
    const printer = new ConsolePrinter()

    printer.printCollapsibleObject('title', { 'username': 'bob' })

    expect(core.startGroup).toBeCalledWith('title')
    expect(core.info).toBeCalledWith('{\n\t"username": "bob"\n}')
    expect(core.endGroup).toBeCalled()
})

test('prints collapsible', () => {
    const printer = new ConsolePrinter()

    printer.printCollapsible('title', 'message')

    expect(core.startGroup).toBeCalledWith('title')
    expect(core.info).toBeCalledWith('message')
    expect(core.endGroup).toBeCalled()
})

test('stringify properly', () => {
    const printer = new ConsolePrinter()

    const result = printer.stringify({ 'username': 'bob' })

    expect(result).toBe('{"username":"bob"}')
})

test('beautifies properly', () => {
    const printer = new ConsolePrinter()

    const result = printer.beautify('{"username":"bob"}')

    expect(result).toBe('{\n\t"username": "bob"\n}')
})

