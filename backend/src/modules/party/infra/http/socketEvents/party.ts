import socketio, { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetPartyDataService from '../../../services/getPartyDataService';
import AddParticipantService from '../../../services/addParticipantService';
import setPartyUrlService from '../../../services/setPartyUrlService';
import setPartyOwnerService from '../../../services/setPartyOwnerService';
import setVideoStateService from '../../../services/setVideoStateService';
import addPeerIdToUserPartyService from '../../../services/addPeerIdToUserPartyService';
import DisconnectUserFromPartyService from '../../../services/disconnectUserFromPartyService';
import SetMetadataService from '../../../services/setMetadataService';

export async function disconnect(
    io: socketio.Server,
    socketId: string,
    socket: socketio.Socket,
) {
    console.log('client disconnected', socketId);

    const socketData = await container
        .resolve(DisconnectUserFromPartyService)
        .execute({ socketId });

    const socketDisconnectedWasOwner =
        socketData?.party?.ownerId === socketData.user.id; // TODO: testar isso
    if (!socketDisconnectedWasOwner) return;

    const newOwner = socketData.party.partiesUsersRelationship.find(
        relationship => relationship.connected,
    );
    if (!newOwner) return;

    partyChangeOwner(io, socket, socketData.party.id, newOwner.peerId);
}

export async function joinParty(socket: socketio.Socket, partyId: string) {
    if (!partyId) {
        socket.emit('party:error', 'Reunião não encontrada');
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
        socket.emit('party:error', 'Falha ao adicionar participante');
    }
}

export async function partyChangeOwner(
    io: socketio.Server,
    socket: socketio.Socket,
    partyId: string,
    newOwnerId: string,
) {
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
        socket.emit('party:error', 'Falha ao alterar controle da reunião');
    }
}

export async function playerReady(
    io: socketio.Server,
    partyId: string,
    url: string,
    socket: socketio.Socket,
) {
    try {
        const video = await container
            .resolve(setPartyUrlService)
            .execute({ partyId, url });

        container.resolve(SetMetadataService).execute({ videoId: video.id });

        io.to(partyId).emit('player:ready', classToClass(video));
    } catch (err) {
        socket.emit('party:error', 'Falha ao adicionar video');
    }
}

export async function setVideoState(
    io: socketio.Server,
    partyId: string,
    isPlaying: boolean,
    playbackRate: number,
    currentTime: number,
    videoId: number,
    socket: socketio.Socket,
) {
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
        // Won't handle this error, cause it's not critical and non-blocking

        console.error(err);
    }
}

export async function peerReady(
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
        socket.emit('party:error', 'Falha ao adicionar à chamada');
    }
}
