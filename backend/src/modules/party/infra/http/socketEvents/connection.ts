import socketio, { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetPartyDataService from '../../../services/getPartyDataService';
import AddParticipantService from '../../../services/addParticipantService';
import setPartyUrlService from '../../../services/setPartyUrlService';
import setPartyOwnerService from '../../../services/setPartyOwnerService';
import setVideoStateService from '../../../services/setVideoStateService';
import GetSocketDataService from '../../../services/getSocketDataService';
import addPeerIdToUserPartyService from '../../../services/addPeerIdToUserPartyService';

export default function connection(
    socket: socketio.Socket,
    io: socketio.Server,
) {
    console.log('client connected', socket.id);
    socket.emit('connect_success');

    socket.on('party:join', async (data: { partyId: string }) => {
        await joinParty(socket, data.partyId);
    });

    socket.on(
        'party:changeOwner',
        async (data: { partyId: string; newOwnerId: string }) => {
            await partyChangeOwner(io, socket, data.partyId, data.newOwnerId);
        },
    );

    socket.on('player:ready', (data: { partyId: string; url: string }) => {
        playerReady(io, data.partyId, data.url);
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

    socket.on('disconnect', () => disconnect(io, socket.id));
}

async function disconnect(io: socketio.Server, socketId: string) {
    console.log('client disconnected', socketId);

    const socketData = await container
        .resolve(GetSocketDataService)
        .execute({ socketId });

    io.sockets.in(socketData.partyId).emit('peer:leave', socketData.peerId);
}

async function joinParty(socket: socketio.Socket, partyId: string) {
    if (!partyId) {
        socket.emit('party:error', 'Missing partyId');
        return;
    }

    try {
        const { sub: userId } = socket.decodedToken;

        await container
            .resolve(AddParticipantService)
            .execute({ partyId, userId: +userId, socketId: socket.id });

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ partyId, userId: +userId });

        socket.join(party.id);

        socket.emit('party:joined', classToClass(party));
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}

async function partyChangeOwner(
    io: socketio.Server,
    socket: socketio.Socket,
    partyId: string,
    newOwnerId: string,
) {
    console.log('party change owner to ', newOwnerId);

    try {
        const { sub: userId } = socket.decodedToken;

        await container.resolve(setPartyOwnerService).execute({
            partyId,
            userId: +userId,
            newOwnerId,
        });

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ partyId, userId: +userId });

        io.to(partyId).emit('party:updated', classToClass(party));
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}

async function playerReady(io: socketio.Server, partyId: string, url: string) {
    console.log('player ready', partyId, url);

    try {
        const video = await container
            .resolve(setPartyUrlService)
            .execute({ partyId, url });

        io.to(partyId).emit('player:ready', classToClass(video));
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}

async function setVideoState(
    io: socketio.Server,
    partyId: string,
    isPlaying: boolean,
    playbackRate: number,
    currentTime: number,
    videoId: number,
    socket: socketio.Socket,
) {
    const { sub: userId } = socket.decodedToken;

    console.log('player State', partyId, userId);

    try {
        const video = await container.resolve(setVideoStateService).execute({
            currentTime,
            isPlaying,
            playbackRate,
            videoId,
            partyId,
        });

        io.to(partyId).emit('player:updateState', classToClass(video));
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}

async function peerReady(
    io: socketio.Server,
    partyId: string,
    peerId: string,
    socket: socketio.Socket,
) {
    console.log('peer ready', peerId);

    const { sub: userId } = socket.decodedToken;

    try {
        await container.resolve(addPeerIdToUserPartyService).execute({
            peerId,
            userId,
            partyId,
        });

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ partyId, userId: +userId });

        io.to(partyId).emit('party:updated', classToClass(party));
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}
