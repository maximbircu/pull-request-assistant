import { Logger } from '../src/infrastructure/logging/Logger'
import { LogLevel } from '../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../src/infrastructure/utils/ConsolePrinter'

jest.mock('../src/infrastructure/logging/LogLevel')
jest.mock('../src/infrastructure/utils/ConsolePrinter')

const testLogLevel = LogLevel.ERROR
const testConsolePrinter = new ConsolePrinter()

global.beforeAll(() => {
    // Disable logger for unit tests
    Logger.init(new Logger(testLogLevel, testConsolePrinter))
})

global.beforeEach(() => {
})

global.afterEach(() => {
})

module.exports = { testLogLevel, testConsolePrinter }
