import Party from './party';

class Hub {
    private parties: Party[] = [];

    public createParty(name: string, userLeader: string) {
        this.parties.push(new Party(name, userLeader));
    }
}
