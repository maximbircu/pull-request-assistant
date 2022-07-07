import { LogLevel } from '../../../src/infrastructure/logging/LogLevel'

jest.unmock('../../../src/infrastructure/logging/LogLevel')

describe('provides proper log level', () => {
    test('provides proper log level given its name', () => {
        LogLevel.levels.forEach((level) => {
            expect(LogLevel.fromName(level.name)).toBe(level)
        })
    })

    test('throws exception in case the level name is not supported', () => {
        expect(() => LogLevel.fromName('inexistent')).toThrow(Error(`inexistent not supported!`))
    })
})

describe('runs the callback when allowed', () => {
    test('runs the callbacks if the log level allows', () => {
        const callback = jest.fn()
        LogLevel.INFO.runIfAllows(LogLevel.SILENT, callback)

        expect(callback).toBeCalled()
    })

    test('does not run the callbacks if the log level does not allow', () => {
        const callback = jest.fn()
        LogLevel.INFO.runIfAllows(LogLevel.DEBUG, callback)

        expect(callback).not.toBeCalled()
    })
})

