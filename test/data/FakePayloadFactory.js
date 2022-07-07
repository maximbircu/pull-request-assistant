export class FakePayloadFactory {
    static create(login = 'bob', name = 'pull-request-assistant', number = 3) {
        return {
            number: number,
            repository: {
                owner: { login: login },
                name: name
            }
        }
    }
}


