import { JsonUtils } from '../../../src/infrastructure/utils/JsonUtils'

test('overrides the config properly', () => {
    const result = JsonUtils.overrideJsonObject(
        {
            assistant_name: 'friday',
            log_level: 'info',
            assistant_controllers: [],
            commands: {
                merge: {
                    default_merge_method: 'merge',
                    required_number_of_approvals: 1,
                    required_checks: [],
                    commit_message_template_path: '/assets/commands/merge/commit-template.txt',
                    issue_id_provider: '(pullRequest) => pullRequest.sourceBranch.match(/\\d+/)[0]',
                    reviewers_provider: '(reviewers) => reviewers.join(\' \')',
                    description_provider: '(pullRequest) => pullRequest.description'
                }
            }
        }, {
            log_level: 'debug',
            assistant_controllers: ['maximbircu'],
            commands: {
                merge: {
                    default_merge_method: 'merge',
                    required_number_of_approvals: 10,
                    required_checks: ['CI'],
                    reviewers_provider: '(reviewers) => reviewers.join(\' \')',
                    description_provider: '(pullRequest) => pullRequest.description'
                }
            }
        }
    )

    expect(result).toEqual({
        assistant_name: 'friday',
        log_level: 'debug',
        assistant_controllers: ['maximbircu'],
        commands: {
            merge: {
                default_merge_method: 'merge',
                required_number_of_approvals: 10,
                required_checks: ['CI'],
                commit_message_template_path: '/assets/commands/merge/commit-template.txt',
                issue_id_provider: '(pullRequest) => pullRequest.sourceBranch.match(/\\d+/)[0]',
                reviewers_provider: '(reviewers) => reviewers.join(\' \')',
                description_provider: '(pullRequest) => pullRequest.description'
            }
        }
    })
})

test('converts the object keys to camel case', () => {
    const result = JsonUtils.convertObjectKeysToCamelCase(
        {
            'assistant_name': 'friday',
            'log_level': 'info',
            'assistant_controllers': [],
            'commands': {
                'merge': {
                    'default_merge_method': 'merge',
                    'required_number_of_approvals': 1,
                    'required_checks': []
                }
            }
        }
    )

    expect(result).toEqual({
        'assistantName': 'friday',
        'logLevel': 'info',
        'assistantControllers': [],
        'commands': {
            'merge': {
                'defaultMergeMethod': 'merge',
                'requiredNumberOfApprovals': 1,
                'requiredChecks': []
            }
        }
    })
})
