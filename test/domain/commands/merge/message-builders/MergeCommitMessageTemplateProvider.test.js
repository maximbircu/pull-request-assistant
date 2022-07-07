import { FileReaderStub } from '../../../../stubs/infrastructure/utils/FileReaderStub'
import {
    MergeCommitMessageTemplateProvider
} from '../../../../../src/domain/commands/merge/message-builders/MergeCommitMessageTemplateProvider'

const fileReaderStub = new FileReaderStub('/workingDirectory')

test('reads default commit template', () => {
    const provider = new MergeCommitMessageTemplateProvider(
        {
            commitMessageTemplatePath: '/assets/commands/merge/commit-template.txt'
        },
        fileReaderStub
    )

    provider.readTemplate()

    expect(fileReaderStub.fileExists)
        .toBeCalledWith('/workingDirectory/assets/commands/merge/commit-template.txt')
    expect(fileReaderStub.readFileSync)
        .toBeCalledWith('/workingDirectory/assets/commands/merge/commit-template.txt')
})

test('reads custom commit template', () => {
    const provider = new MergeCommitMessageTemplateProvider(
        {
            commitMessageTemplatePath: '/merge/commit-template.txt'
        },
        fileReaderStub
    )

    provider.readTemplate()

    expect(fileReaderStub.fileExists).toBeCalledWith('/merge/commit-template.txt')
    expect(fileReaderStub.readFileSync).toBeCalledWith('/merge/commit-template.txt')
})

test('throws error in case the path does not exist', () => {
    fileReaderStub.enqueueFileExits(false)
    const provider = new MergeCommitMessageTemplateProvider(
        {
            commitMessageTemplatePath: '/merge/commit-template.txt'
        },
        fileReaderStub
    )

    expect(() => provider.readTemplate())
        .toThrow(
            'The provided "commit_message_template_path:/merge/commit-template.txt" doesn\'t exist'
        )
})
