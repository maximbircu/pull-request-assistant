import { Validator } from 'jsonschema'
import { JsonUtils } from '../../infrastructure/utils/JsonUtils'
import { FileReader } from '../../infrastructure/utils/FileReader'

export class ConfigProvider {
    #fileReader
    #validator = new Validator()

    #configSchemaPath
    #defaultConfigFilepath
    #customConfigFilePath

    constructor(configSchemaPath, defaultConfigFilepath, customConfigFilePath = '') {
        this.#fileReader = new FileReader()
        this.#validator = new Validator()

        this.#configSchemaPath = configSchemaPath
        this.#defaultConfigFilepath = defaultConfigFilepath
        this.#customConfigFilePath = customConfigFilePath

        const config = this.loadConfig()
        this.validateConfig(config)

        this._config = JsonUtils.convertObjectKeysToCamelCase(config)
    }

    get config() {
        return this._config
    }

    loadConfig() {
        const defaultConfig = this.readJsonFile(this.#defaultConfigFilepath)
        if (this.#customConfigFilePath.trim()) {
            if (this.#fileReader.fileExists(this.#customConfigFilePath)) {
                const userConfig = this.readJsonFile(this.#customConfigFilePath)
                return JsonUtils.overrideJsonObject(defaultConfig, userConfig)
            } else {
                throw new Error('The config file doesn\'t exists or the provided path is wrong!')
            }
        }
        return defaultConfig
    }

    validateConfig(config) {
        const schema = this.readJsonFile(this.#configSchemaPath)
        const errors = this.#validator.validate(config, schema).errors
        if (errors.length !== 0) {
            throw Error(`Config validation error: ${JsonUtils.stringifyAndFormat(errors)}`)
        }
    }

    readJsonFile(filePath) {
        const jsonString = this.#fileReader.readFileSync(filePath)
        return JsonUtils.stringToJson(jsonString)
    }
}
