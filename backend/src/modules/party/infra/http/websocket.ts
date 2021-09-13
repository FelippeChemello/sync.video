import socketio from 'socket.io';
import { container } from 'tsyringe';

import GetPartyDataService from '../../services/getPartyData';

export const connection = (socket: socketio.Socket) => {
    socket.on('selectParty', async data => {
        if (!data.partyId) {
            socket.emit('partyError');
            return;
        }

        const { partyId } = data;

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ partyId });

        socket.emit('joinedParty', party);
    });

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
    });
};
