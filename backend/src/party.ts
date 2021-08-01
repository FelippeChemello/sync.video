import {v4 as uuid} from 'uuid'

export default class Party {
    private users: string[] = [];
    private uri: string;

    constructor(private name: string, private leader: string) {
        this.users.push(leader);
        this.uri = uuid()
    }
}
