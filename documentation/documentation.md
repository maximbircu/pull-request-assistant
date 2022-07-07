# Documentation

<img width="500" align="right" alt="dev-tools" src="https://user-images.githubusercontent.com/12527390/177862788-5628b6a6-5d09-412f-b199-3725e46cf9d2.png"/>

* 🚀 [Quick start](quick-start.md)
* 🔧 [Configuration](configuration.md)
* 📃 [Commands](#commands)
    * [merge](commands/merge.md)
* 👷 [For developers](#-for-developers)
    * [Contributing guidelines](../CONTRIBUTING.md)
    * [Project structure](#project-structure)
    * [Develop a new command](#develop-a-new-command)
    * [Deployment](#deployment)
* 📜 [License](../README.md#license)

<br />

Pull Request Assistant is a GitHub Action which helps automate different routines that we're usually running on Pull
Requests.

Using it you can execute commands on your Pull Request exactly the same as in a CLI. The commands could be executed by
simply adding them as a comment to the Pull Request.

You can check out the full list of supported commands and information about how to use them and how they work below.

For now there is only one command supported but the project is based
on [commander](https://www.npmjs.com/package/commander) and it's very easy to add new commands. Thus feel free
to report new issues and contribute to this awesome project.

### How the assistant works

Every new comment added to the Pull Request is triggering the Assistant workflow. The assistant fetches
the comments and looks for commands he could execute.

Note that the assistant will execute only the last Active command and all other commands will be either ignored or
cancelled.

A command is considered active if:

- it's at the bottom of the Pull Request feed
- it's left by an assistant controller (it's possible to define a set of assistant controllers through a config file
  check out [Configuration](configuration.md) for more details.)
- it doesn't have a status or its status is "Pending 🟡"

In case you want to cancel an active command it's sufficient to delete the comment.

# Commands

| [merge](commands/merge.md) | <img width="500" alt="image" src="https://user-images.githubusercontent.com/12527390/178052522-fb4aac1a-d7ee-4bfa-8f5b-35cec5ba3b81.png"> |
|---------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------|

# 👷 For Developers

If you know how to fix an issue, or want to add new features consider opening a pull request for it. 🙏

You can read the repository’s [contributing guidelines](../CONTRIBUTING.md) to learn how to open a good pull request.

## Project structure

The project is based on [commander](https://www.npmjs.com/package/commander) thus, it's very easy to add new commands.

The project is divided in 3 layers:

- data (where all the code that gathers some data sits)
- domain (for the business logic of the tool)
- infrastructure (for all kind of utils, helpers and infra related stuff)

## Develop a new command

It's relatively easy to add and develop a new command.
To do this you have to:

1. Create a new package for the command inside [commands](../src/domain/commands/)
2. Create a new class for the command inside the previously created package `MyCommand` which should
   extend [AssistantCommand](../src/domain/AssistantCommand.js)
    1. You'll have to override 2 methods:
        1. `configure(command)` - you can use command argument to configure its parameters (read more about how to do
           this
           here https://github.com/tj/commander.js)
        2. `async execute(args)` - implement the logic of your command in this method
3. To make your command known to the assistant, instantiate and add it to the commands array from
   the [DomainModule.js](../src/di/DomainModule.js)

## Deployment

The deployment process is fully automated. To start it you just need to:

1. `git checkout master`
2. `git fetch origin && git reset --hard origin/master`
3. `git branch -b relase-<version-name>`
4. `git push`
