# Quick start 

To quickly get started just add the assistant GitHub Actions workflow to `.github/workflows/pull-request-assistant.yml`
inside the root of your repository.

   ```yaml
   name: Friday

   on:
     issue_comment:
       types: [ created ]
     pull_request_review:
       types:
         - submitted
     check_suite:
       types:
         - completed

   jobs:
     friday:
       runs-on: ubuntu-latest
       env:
         GITHUB_TOKEN: ${{ secrets.ACCESS_TOKEN }}
       steps:
         - name: SCM
           uses: actions/checkout@v2

         - name: Run assistant
           uses: maximbircu/pull-request-assistant@1.0.0

           env:
             GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
   ```

### Congratulations 🎉

You're done. Now to check that everything works fine just open a new Pull Request and try to run any
command by adding a comment containg `friday --help`

<img width="600" src="https://user-images.githubusercontent.com/12527390/178046528-7e30ae71-fe84-49ba-a732-44288cb93e99.png"/>

After a short a mount of time the command should be executed and the comment should change.

<img width="600" src="https://user-images.githubusercontent.com/12527390/178046783-0ca2c91b-1df8-44db-828c-31acca5fa609.png"/>

Thus, you can basically explore the assistant's abilities using the `friday --help` command.

If you're looking for moe ways to configure the assistant you can check out:

- [🔧 Configuration]()
- [📃 Commands](samples/android)
- 📜 [Documentation](documentation.md)

## 👷 For Developers

Consider improving this project with whatever commands you feel might be useful. 🙏

You can read the repository’s [contributing guidelines](../CONTRIBUTING.md) to learn how to open a good pull request.

