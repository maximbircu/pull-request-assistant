# Configuration

The Assistant could be configured by defining a JSON configuration file. The easiest way to find out the
supported configuration parameters would be to take a look at:

- [Configuration File JSON Schema](../assets/config-schema.json)
- [Default Configuration File](../assets/default-config.json)

In case you want to adjust the default configuration, you should:

1. add a new config file to your repository. For example `friday-config.json`
2. Indicate the path to the config file inside your GH Action workflow YAML file.
   ```yaml
   - name: Run assistant
     uses: maximbircu/pull-request-assistant@3-implement-assistant-and-merge-command
     with:
       config-file-path: friday-config.json
   ```

ℹ️ Note that there is no need to duplicate the whole default config file, it's enough to add just
the properties you want to change. The custom config file gets merged into default one.

## 👷 For Developers

Consider opening pull requests and adding new configuration options if you need more. 🙏

You can read the repository’s [contributing guidelines](../CONTRIBUTING.md) to learn how to open a good pull request.
