import { CheckRun } from '../../../../../src/data/pull-request/models/check-run/CheckRun'
import {
    CheckRunConclusion
} from '../../../../../src/data/pull-request/models/check-run/CheckRunConclusion'
import { CheckRunStatus } from '../../../../../src/data/pull-request/models/check-run/CheckRunStatus'

test('creates a proper merge response from raw data', () => {
    expect(CheckRun.createFromRawData(
        {
            name: 'pull-request-assistant',
            status: CheckRunStatus.COMPLETED,
            conclusion: CheckRunConclusion.SUCCESS
        }
    )).toStrictEqual(
        new CheckRun(
            'pull-request-assistant',
            CheckRunStatus.COMPLETED,
            CheckRunConclusion.SUCCESS
        )
    )
})

describe('calculates properly the check run completion status', () => {
    test('returns true completion if status is completed with success conclusion', () => {
        expect(CheckRun.createFromRawData(
            {
                name: 'pull-request-assistant',
                status: CheckRunStatus.COMPLETED,
                conclusion: CheckRunConclusion.SUCCESS
            }
        ).isCompletedSuccessfully).toBeTruthy()
    })

    test('returns false completion if status is not completed', () => {
        expect(CheckRun.createFromRawData(
            {
                name: 'pull-request-assistant',
                status: CheckRunStatus.RUNNING,
                conclusion: CheckRunConclusion.SUCCESS
            }
        ).isCompletedSuccessfully).toBeFalsy()
    })

    test('returns false completion if conclusion is not success', () => {
        expect(CheckRun.createFromRawData(
            {
                name: 'pull-request-assistant',
                status: CheckRunStatus.COMPLETED,
                conclusion: CheckRunConclusion.FAILED
            }
        ).isCompletedSuccessfully).toBeFalsy()
    })
})
