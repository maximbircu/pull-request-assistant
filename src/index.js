import { DataModule } from './di/DataModule'
import { DomainModule } from './di/DomainModule'
import { ConfigProvider } from './data/config/ConfigProvider'
import { Logger } from './infrastructure/logging/Logger'
import { LogLevel } from './infrastructure/logging/LogLevel'
import { ConsolePrinter } from './infrastructure/utils/ConsolePrinter'
import { CommandBuilderProvider } from './domain/CommandBuilderProvider'
import { program } from 'commander'

CommandBuilderProvider.init(program)

const github = require('@actions/github')
const core = require('@actions/core')

const configProvider = new ConfigProvider(
    `${__dirname}/assets/config-schema.json`,
    `${__dirname}/assets/default-config.json`,
    core.getInput('config-file-path')
)
Logger.init(new Logger(LogLevel.fromName(configProvider.config.logLevel), new ConsolePrinter()))

const dataModule = new DataModule()
const domainModule = new DomainModule(dataModule, configProvider)

Logger.getInstance().infoCollapsibleObject('Action Config', configProvider.config)
Logger.getInstance().debugCollapsibleObject('Github Context', github.context)

domainModule.assistant.operate()
    .catch((error) => Logger.getInstance().error(error))
