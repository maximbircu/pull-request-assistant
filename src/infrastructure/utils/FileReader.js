import fs from 'fs'

export class FileReader {
    fileExists(path) {
        return fs.existsSync(path)
    }

    readFileSync(path) {
        return `${fs.readFileSync(path, { encoding: 'utf-8' })}`
    }

    get dirName() {
        return __dirname
    }
}
