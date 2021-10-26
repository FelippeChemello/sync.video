import socketio, { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetPartyDataService from '../../../services/getPartyDataService';
import AddParticipantService from '../../../services/addParticipantService';
import setPartyUrlService from '../../../services/setPartyUrlService';
import setPartyOwnerService from '../../../services/setPartyOwnerService';
import setVideoStateService from '../../../services/setVideoStateService';
import GetSocketDataService from '../../../services/getSocketDataService';

export default function connection(
    socket: socketio.Socket,
    io: socketio.Server,
) {
    console.log('client connected', socket.id);

    socket.on(
        'party:join',
        async (data: { partyId: string; peerId: string }) => {
            await joinParty(socket, data.partyId, data.peerId);
        },
    );

    socket.on(
        'party:changeOwner',
        async (data: { partyId: string; newOwnerId: number }) => {
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
        peerReady(io, data.partyId, data.peerId);
    });

    socket.on('disconnect', () => disconnect(io, socket.id));
}

async function disconnect(io: socketio.Server, socketId: string) {
    console.log('client disconnected', socketId);

    const socketData = await container
        .resolve(GetSocketDataService)
        .execute({ socketId });

    io.sockets.in(socketData.partyId).emit('peer:quit', socketData.peerId);
}

async function joinParty(
    socket: socketio.Socket,
    partyId: string,
    peerId: string,
) {
    if (!partyId || !peerId) {
        socket.emit('party:error');
        return;
    }

    try {
        const { sub: userId } = socket.decodedToken;

        await container
            .resolve(AddParticipantService)
            .execute({ partyId, userId: +userId, socketId: socket.id, peerId });

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
    newOwnerId: number,
) {
    console.log('party change owner');

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

        io.to(partyId).emit('party:changeOwner', classToClass(party));
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

async function peerReady(io: socketio.Server, partyId: string, peerId: string) {
    console.log('peer ready', peerId);

    try {
        io.to(partyId).emit('peer:joined', peerId);
    } catch (err) {
        console.log(err); // TODO: handle error
    }
}
