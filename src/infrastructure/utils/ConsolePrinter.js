const core = require('@actions/core')
const jsonStringFormatter = require('json-string-formatter')

export class ConsolePrinter {
    print(message) {
        console.log(message)
    }

    printCollapsibleObject(title, object) {
        this.printCollapsible(title, this.beautify(this.stringify(object)))
    }

    printCollapsible(title, message) {
        core.startGroup(title)
        core.info(message)
        core.endGroup()
    }

    stringify(object) {
        return `${JSON.stringify(object)}`
    }

    beautify(jsonString) {
        return jsonStringFormatter.format(jsonString)
    }
}
