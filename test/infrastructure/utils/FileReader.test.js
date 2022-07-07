import { FileReader } from '../../../src/infrastructure/utils/FileReader'
import fs from 'fs'

jest.mock('fs')

test('checks if the file exists', () => {
    const fileReader = new FileReader()
    fs.existsSync.mockReturnValue(false)

    const doesFileExist = fileReader.fileExists('/path/to/file.txt')

    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/file.txt')
    expect(doesFileExist).toBeFalsy()
})

test('reads file with utf-8 encoding', () => {
    const fileReader = new FileReader()
    fs.readFileSync.mockReturnValue('File contents')

    const fileContent = fileReader.readFileSync('/path/to/file.txt')

    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/file.txt', { encoding: 'utf-8' })
    expect(fileContent).toEqual('File contents')
})
