import { FakePayloadFactory } from '../../data/FakePayloadFactory'

export class GithubContextStub {
    payload = FakePayloadFactory.create('bob', 'pull-request-assistant', 3)
}
