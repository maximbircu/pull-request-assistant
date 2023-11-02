# merge

The merge command helps to automate the Pull Requests merging. If you want the assistant
to take care of merging the Pull Request, then you can simply add a comment `friday merge`.

In this case the assistant will automatically merge the PR when it will be ready to be merged.

Note that the PR will be merged only when:

- There are no conflicts
- There are no failing check runs
- There is enough number of approvals

### Configuration

|                              | default                                                            | options                | description                                                                                                              |
|-----------------------------:|--------------------------------------------------------------------|------------------------|--------------------------------------------------------------------------------------------------------------------------|
| default_merge_method         | merge                                                              | merge/squash/rebase    | the default merge method that will be used by assistant                                                                  |
| required_number_of_approvals | 1                                                                  | any decimal            | the number of required minimal approvals that the PR should have before the assistant will merge it                      |
| required_checks              | []                                                                 | array of strings       | the list of required GitHub checks that need to pass before merging                                                      |
| commit_message_template_path | /assets/commands/merge/commit-template.txt                         | any path               | the path to your custom commit message template file in case you want to define a custom one                             |
| issue_id_provider            | (pullRequest) => pullRequest.sourceBranch.match(/<br>\\<br>d+/)[0] | any JS lambda function | a java function that will provide the issue number of the PR in case you want it to be added to the merge commit message |
| reviewers_provider           | (reviewers) => reviewers.join(' ')                                 | any JS lambda function | a java function that will provide the list of reviews - you can use it to map it if you need it                          |
| description_provider         | (pullRequest) => pullRequest.description                           | any JS lambda function | a java function that will provide a description that should be added to the merge commit message                         |

Default commit message template

```
Issue: {issue_id}
Reviewers: {reviewers}
PR: GH-{pr_number}

{description}
```

Additional options
- `friday merge`
- `friday merge -h`
- `friday merge --dry-run`
- `friday merge --merge-method squash`

Demo

<img width="400" src="https://user-images.githubusercontent.com/12527390/177853303-b3ea82e8-ea87-41e7-8c77-fa956883843c.png"/>
<img width="400" src="https://user-images.githubusercontent.com/12527390/177853399-8d6527c1-ea9f-41bc-8cd2-5f52bd640b85.png"/>
<img width="400" src="https://user-images.githubusercontent.com/12527390/177853471-8f48e8f1-8939-489c-9735-37de46dc3a31.png"/>
<img width="400" src="https://user-images.githubusercontent.com/12527390/177853592-cbdffc9f-578b-47b7-b5db-0ce19ab607e3.png"/>
