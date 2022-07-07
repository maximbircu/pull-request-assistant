export class FileReaderStub {
    fileExists = jest.fn(() => true)
    readFileSync = jest.fn()

    constructor(dirName = '/workingDirectory') {
        this.dirName = dirName
    }

    enqueueData(data) {
        this.readFileSync = jest.fn(() => data)
    }

    enqueueFileExits(fileExists) {
        this.fileExists = jest.fn(() => fileExists)
    }
}
