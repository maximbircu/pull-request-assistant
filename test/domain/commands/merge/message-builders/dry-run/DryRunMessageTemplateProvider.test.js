import {
    DryRunMessageTemplateProvider
} from '../../../../../../src/domain/commands/merge/message-builders/dry-run/DryRunMessageTemplateProvider'
import { FileReaderStub } from '../../../../../stubs/infrastructure/utils/FileReaderStub'

const fileReaderStub = new FileReaderStub('/workingDir')

test('reads proper dry run template file', () => {
    const templateProvider = new DryRunMessageTemplateProvider(fileReaderStub)

    templateProvider.dryRunTemplate()

    expect(fileReaderStub.readFileSync)
        .toBeCalledWith('/workingDir/assets/commands/merge/dry-run-template.txt')
})

test('reads proper dry run rebase template file', () => {
    const templateProvider = new DryRunMessageTemplateProvider(fileReaderStub, '/workingDir')

    templateProvider.dryRunRebaseTemplate()

    expect(fileReaderStub.readFileSync)
        .toBeCalledWith('/workingDir/assets/commands/merge/dry-run-rebase-template.txt')
})
