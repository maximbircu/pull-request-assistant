import { Logger } from '../../../src/infrastructure/logging/Logger'
import { LogLevel } from '../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../src/infrastructure/utils/ConsolePrinter'
import { testLogLevel, testConsolePrinter } from '../../setupTests'

const { INFO, DEBUG, ERROR } = LogLevel

beforeEach(() => {
    testLogLevel.runIfAllows.mockImplementation((level, callback) => callback())
})

test('throws error when its initialised twice', () => {
    expect(() => Logger.init(new Logger(LogLevel.SILENT, new ConsolePrinter())))
        .toThrow(Error('Cant not reset a singleton object'))
})

test('logs info properly', () => {
    const logger = Logger.getInstance()

    logger.info('info message')

    expect(testLogLevel.runIfAllows).toBeCalledWith(INFO, expect.any(Function))
    expect(testConsolePrinter.print).toBeCalledWith('info message')
})

test('logs info collapsible properly', () => {
    const logger = Logger.getInstance()

    logger.infoCollapsible('tag', 'info message')

    expect(testLogLevel.runIfAllows).toBeCalledWith(INFO, expect.any(Function))
    expect(testConsolePrinter.printCollapsible).toBeCalledWith('tag', 'info message')
})

test('logs info collapsible object properly', () => {
    const logger = Logger.getInstance()

    logger.infoCollapsibleObject('tag', {})

    expect(testLogLevel.runIfAllows).toBeCalledWith(INFO, expect.any(Function))
    expect(testConsolePrinter.printCollapsibleObject).toBeCalledWith('tag', {})
})

test('logs debug collapsible properly', () => {
    const logger = Logger.getInstance()

    logger.debugCollapsible('tag', 'debug message')

    expect(testLogLevel.runIfAllows).toBeCalledWith(DEBUG, expect.any(Function))
    expect(testConsolePrinter.printCollapsible).toBeCalledWith('tag', 'debug message')
})

test('logs debug collapsible object properly', () => {
    const logger = Logger.getInstance()

    logger.debugCollapsibleObject('tag', {})

    expect(testLogLevel.runIfAllows).toBeCalledWith(DEBUG, expect.any(Function))
    expect(testConsolePrinter.printCollapsibleObject).toBeCalledWith('tag', {})
})

test('logs error properly', () => {
    const logger = Logger.getInstance()

    logger.error('error message')

    expect(testLogLevel.runIfAllows).toBeCalledWith(ERROR, expect.any(Function))
    expect(testConsolePrinter.print).toBeCalledWith('error message')
})

