<img width="400" align="right" alt="dev-tools" src="https://user-images.githubusercontent.com/12527390/177862788-5628b6a6-5d09-412f-b199-3725e46cf9d2.png"/>

[![CI](https://github.com/maximbircu/pull-request-assistant/actions/workflows/master.yaml/badge.svg?branch=master)](https://github.com/maximbircu/pull-request-assistant/actions/workflows/master.yaml)
[![codecov](https://codecov.io/gh/maximbircu/pull-request-assistant/branch/master/graph/badge.svg?token=SHTOR2H82V)](https://codecov.io/gh/maximbircu/pull-request-assistant)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/maximbircu/pull-request-assistant/blob/master/LICENSE)

# Pull Request Assistant (Friday 🤖)

#### 🚀 [Quick Start](documentation/quick-start.md) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [🔧 Configuration](documentation/configuration.md)</div>
#### 📜 [Documentation](documentation/documentation.md) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [📃 Commands](documentation/documentation.md#commands)
#### 👷 [For Developers](documentation/documentation.md#-for-developers)

<br />

Pull Request Assistant is a GitHub Action which helps automate different routines that we're usually running on Pull Requests.

Using it, you can execute commands on your Pull Request exactly the same as in a terminal. The commands could be executed by simply adding them as a comment to the Pull Request.

At the moment, there is only one command that you can use - which is [merge](documentation/commands/merge.md) and which helps you merge the PRs easier.
However, the project is based on [commander](https://www.npmjs.com/package/commander), and it's very easy to add new commands. Thus feel free
to report new issues and contribute to this awesome project.

p.s. you can set the name you like for the assistant however the default name is Friday. I consider it a 
continuation of https://github.com/maximbircu/friday :)

License
-------

    Copyright 2022 Maxim Bîrcu

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
