import socketio from 'socket.io';
import { container } from 'tsyringe';

import GetPartyDataService from '../../services/getPartyData';
import AddParticipantService from '../../services/addParticipantService';
import { classToClass } from 'class-transformer';

export const connection = (socket: socketio.Socket) => {
    socket.on('selectParty', async data => {
        if (!data.partyId) {
            socket.emit('partyError');
            return;
        }

        try {
            const { partyId } = data;
            const { sub: userId } = socket.decodedToken;

            await container
                .resolve(AddParticipantService)
                .execute({ partyId, userId: +userId, sockedId: socket.id });

            const party = await container
                .resolve(GetPartyDataService)
                .execute({ partyId, userId: +userId });

            socket.join(party.id);

            socket.emit('joinedParty', classToClass(party));
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
    });
};
