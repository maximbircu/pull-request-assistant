const fs = require('fs')
const execSync = require('child_process').execSync

execute = (command) => {
    console.log(`Executing: ${command}`)
    console.log(execSync(command, { encoding: 'utf-8' }).trimEnd())
}

executeSync = (command) => {
    console.log(`Executing: ${command}`)
    return execSync(command, { encoding: 'utf-8' }).trimEnd()
}

setUpGit = () => {
    execute('git config --global user.name "maximbircu"')
    execute('git config --global user.name "maximbircu@users.noreply.github.com"')
}

class ArtifactsDeployer {
    deploy(version) {
        execute('yarn build')
        this.pushArtifacts()
        this.pushAnnotatedTag(version)
    }

    pushArtifacts() {
        execute('git add --force dist/')
        execute('git commit -m "Add new artifacts"')
        execute('git push')
    }

    pushAnnotatedTag(version) {
        execute(`git tag ${version}`)
        execute(`git push origin ${version}`)
    }
}

class VersionUpdater {
    #projectFileParser

    constructor(projectFileParser) {
        this.#projectFileParser = projectFileParser
    }

    updateVersion = (releaseVersion) => {
        const newVersion = this.incrementPatch(releaseVersion)
        execute('git fetch origin')
        execute('git checkout origin/master')
        this.#projectFileParser.setVersionNameToPackageJson(newVersion)
        this.#projectFileParser.updateChangelog(releaseVersion)
    }

    incrementPatch(versionName) {
        const versionParts = versionName.split('.')
        return `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`
    }
}

class ProjectFilesParser {
    get versionFromPackageJson() {
        return executeSync(`node -pe "require('./package.json')['version']"`)
    }

    setVersionNameToPackageJson(newVersion) {
        const data = fs.readFileSync(`package.json`, 'utf8')
        const newData = data.replace(/"version":.*"(.*)"/, `"version": "${newVersion}"`)
        fs.writeFileSync(
            'package.json',
            newData,
            'utf8'
        )
    }

    updateChangelog(versionName) {
        const date = new Date()
        const dateText = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        const changelogData = fs.readFileSync(`CHANGELOG.md`, 'utf8')
        const newChangelogData = changelogData.replace(
            /## \*\(In development\)\*/,
            `## *(In development)*\n\n## Version ${versionName} *${dateText}*`
        )
        fs.writeFileSync(
            'CHANGELOG.md',
            newChangelogData,
            'utf8'
        )
    }
}

const artifactsDeployer = new ArtifactsDeployer()
const projectFileParser = new ProjectFilesParser()
const versionUpdater = new VersionUpdater(projectFileParser)

setUpGit()
switch (process.argv[2]) {
    case 'release':
        artifactsDeployer.deploy(projectFileParser.versionFromPackageJson)
        break
    case `prepare-next-version`:
        versionUpdater.updateVersion(projectFileParser.versionFromPackageJson)
        break
    default:
        throw Error(`Unknown command: ${process.argv[2]}`)
}
