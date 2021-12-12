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
import SetNewOwnerInRoomWithoutOwner from '../../../services/setNewOwnerInRoomWithoutOwner';

export async function disconnect(
    io: socketio.Server,
    socketId: string,
    socket: socketio.Socket,
) {
    try {
        const socketData = await container
            .resolve(DisconnectUserFromPartyService)
            .execute({ socketId });

        console.log('client disconnected', socketData.userId);

        const socketDisconnectedWasOwner =
            socketData?.party?.ownerId === socketData.user.id;
        if (!socketDisconnectedWasOwner) {
            console.log("user wasn't owner, so we're not changing owner");
            return;
        }

        const newOwner = await container
            .resolve(SetNewOwnerInRoomWithoutOwner)
            .execute({
                lastOwnerId: socketData.userId,
                partyId: socketData.party.id,
            });

        const party = await container
            .resolve(GetPartyDataService)
            .execute({ userId: newOwner.userId, partyId: newOwner.partyId });

        io.to(socketData.party.id).emit('party:updated', classToClass(party));
    } catch (err) {
        console.log(err);
    }
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

// TODO: Change to userId
export async function partyChangeOwner(
    io: socketio.Server,
    socket: socketio.Socket,
    partyId: string,
    newOwnerId: number,
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
        console.log(err);
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
