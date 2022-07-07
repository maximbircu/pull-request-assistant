export class MergeCommitMessageTemplateProviderStub {
    readTemplate(template) {
        return template == null ? 'Issue: {issue_id}\n' +
            'Reviewers: {reviewers}\n' +
            'PR: GH-{pr_number}\n\n' +
            '{description}\n' : template
    }
}
