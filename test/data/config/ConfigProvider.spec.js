import { FileReader } from '../../../src/infrastructure/utils/FileReader'
import { ConfigProvider } from '../../../src/data/config/ConfigProvider'
import { Validator } from 'jsonschema'

test('loads default config if a path to custom config was not provided', () => {
    mockFileReader()
    mockValidator()

    const provider = createProvider('config-schema.json', 'default-config.json', '')

    expect(provider.config).toEqual({
        'assistantName': 'friday',
        'logLevel': 'info'
    })
})

test('overrides default config with the custom provided config', () => {
    mockFileReader()
    mockValidator()

    const provider = createProvider()

    expect(provider.config).toEqual({
        'assistantName': 'friday',
        'logLevel': 'error'
    })
})

test('throws error in case the custom config file does not exist', () => {
    const data = { ...fakeData }
    data['custom-config.json'] = null
    mockFileReader(data)
    mockValidator()

    expect(() => {
        createProvider()
    }).toThrow(Error('The config file doesn\'t exists or the provided path is wrong!'))
})

test('throws an error if the config does not match the schema', () => {
    mockFileReader()
    mockValidator([{}])

    expect(() => {
        createProvider()
    }).toThrow(
        Error('Config validation error: [\n' +
            '\t{\n' +
            '\t\t\n' +
            '\t}\n' +
            ']')
    )
})

const createProvider = (
    configSchemaPath = 'config-schema.json',
    defaultConfigFilepath = 'default-config.json',
    customConfigFilePath = 'custom-config.json'
) => new ConfigProvider(configSchemaPath, defaultConfigFilepath, customConfigFilePath)

jest.mock('../../../src/infrastructure/utils/FileReader')
const mockFileReader = (data = fakeData) => {
    FileReader.mockImplementation(() => {
        return {
            readFileSync: (path, encoding) => JSON.stringify(data[path] || ''),
            fileExists: (path) => !!data[path]
        }
    })
}

jest.mock('jsonschema')
const mockValidator = (errors = []) => {
    Validator.mockImplementation(() => {
        return {
            validate: (config, schema) => {
                return { errors }
            }
        }
    })
}

const fakeData = {
    'config-schema.json': {
        '$schema': 'https://json-schema.org/draft/2019-09/schema',
        'type': 'object',
        'additionalProperties': false,
        'properties': {
            'assistant_name': {
                'type': 'string',
                'default': 'friday',
                'description': 'Some description'
            },
            'assistant_controllers': {
                'type': 'array',
                'default': [],
                'description': 'A short description'
            },
            'log_level': {
                'type': 'string',
                'enum': [
                    'silent',
                    'info',
                    'debug'
                ],
                'default': 'info',
                'description': 'Some description here'
            }
        }
    },
    'default-config.json': {
        'assistant_name': 'friday',
        'log_level': 'info'
    },
    'custom-config.json': {
        'log_level': 'error'
    }
}
