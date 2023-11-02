Changelog
=========

## *(In development)*
- Add `required_checks` config property to allow for a custom list of required GitHub Checks to pass before merging

## Version 1.0.1 *2023-0-12*
Issue: [#13](https://github.com/maximbircu/pull-request-assistant/issues/13)
- Do not block Friday command in case the controllers list is empty

## Version 1.0.0 *2022-6-8*
Issue: [#7](https://github.com/maximbircu/pull-request-assistant/issues/7)
- Add `release` and `prepare-next-version` scripts to `packages.json`

Issue: [#5](https://github.com/maximbircu/pull-request-assistant/issues/5)
- Cover the Assistant tool with a set of docs
- Add descriptions for the properties from the configuration JSON schema file

Issue: [#5](https://github.com/maximbircu/pull-request-assistant/issues/5)
- Cover the Assistant tool with a set of docs
- Add descriptions for the properties from the configuration JSON schema file

Issue: [#3](https://github.com/maximbircu/pull-request-assistant/issues/3)
- Implemented the PR Assistant logic based on https://www.npmjs.com/package/commander
- Made the PR Assistant logic configurable using a JSON config file
- Fixed typos form `.github` configuration
- Configured Codecov
- Implemented "merge" the very first assistant command

Issue: [#1](https://github.com/maximbircu/pull-request-assistant/issues/1)
- Set up a new project for the Pull Request Assistant GitHub action.
  - Set up lint
  - Set up jest for testing
- Configure a GH actions flow for the master branch
- Configure a GH actions flow for pull requests
- Configure a GH actions flow for releases
- Set up GH issue templates
- Set up a GH Pull Request template
