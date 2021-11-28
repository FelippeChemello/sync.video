import { authorize } from '@thream/socketio-jwt';
import socketio from 'socket.io';

import authConfig from '../../../config/auth';
import { server } from './http';
import {
    disconnect,
    joinParty,
    partyChangeOwner,
    peerReady,
    playerReady,
    setVideoState,
} from '../../../modules/party/infra/http/socketEvents/party';

const io: socketio.Server = new socketio.Server();

function startSocketIo() {
    io.attach(server, {
        cors: { origin: '*' },
    });

    io.use(authorize({ secret: authConfig.jwt.secret }));

    io.on('connection', socket => {
        console.log('client connected', socket.id);
        socket.emit('connect_success');

        socket.on('party:join', async (data: { partyId: string }) => {
            await joinParty(socket, data.partyId);
        });

        socket.on(
            'party:changeOwner',
            async (data: { partyId: string; newOwnerId: string }) => {
                await partyChangeOwner(
                    io,
                    socket,
                    data.partyId,
                    data.newOwnerId,
                );
            },
        );

        socket.on('player:ready', (data: { partyId: string; url: string }) => {
            playerReady(io, data.partyId, data.url, socket);
        });

        socket.on(
            'player:updateState',
            (data: {
                partyId: string;
                isPlaying: boolean;
                playbackRate: number;
                currentTime: number;
                videoId: number;
            }) => {
                setVideoState(
                    io,
                    data.partyId,
                    data.isPlaying,
                    data.playbackRate,
                    data.currentTime,
                    data.videoId,
                    socket,
                );
            },
        );

        socket.on('peer:ready', (data: { partyId: string; peerId: string }) => {
            peerReady(io, data.partyId, data.peerId, socket);
        });

        socket.on('disconnect', () => disconnect(io, socket.id, socket));
    })
}

export { io, startSocketIo };
