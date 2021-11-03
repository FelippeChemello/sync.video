import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import { useConfig } from '../hooks/Config';

const Container = styled.div`
    position: relative;
    width: 100%;
    margin: 20px;
    margin: 0 auto;

    > video {
        width: 100%;
        transform: scaleX(-1);
    }
`;

type VideoConferenceProps = {
    peer: any;
    socket: Socket;
    peersAlreadyConnected: string[];
    partyId: string;
};

export default function VideoConference({
    peer,
    socket,
    peersAlreadyConnected,
    partyId,
}: VideoConferenceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const peers: string[] = [];

    const { webcamStream } = useConfig();

    useEffect(() => {
        if (!webcamStream) return;

        addVideoStream(webcamStream, peer.id);
    }, [webcamStream]);

    useEffect(() => {
        if (!webcamStream || !peer || !socket) return;

        if (socket.hasListeners('peer:joined')) {
            socket.off('peer:joined');
        }

        console.log('peer', peer);

        peer.on('call', call => {
            console.log('Peer received call and answer');

            call.answer(webcamStream);

            call.on('stream', (remoteStream: MediaStream) => {
                addVideoStream(remoteStream, call.peer);
            });
        });

        socket.on('peer:joined', (joinedPeerId: string) => {
            console.log('joinedPeerId', joinedPeerId, webcamStream);

            addPeer(joinedPeerId, webcamStream);
        });

        socket.on('peer:quit', (quittedPeerId: string) => {
            console.log('quittedPeerId', quittedPeerId);

            removeVideoStream(quittedPeerId);
        });

        socket.emit('peer:ready', { partyId, peerId: peer.id });
    }, [socket, peer, webcamStream]);

    const addPeer = useCallback(
        (peerIdToConnect: string, myStream: MediaStream) => {
            const call = peer.call(peerIdToConnect, myStream);

            call.on('stream', (stream: MediaStream) => {
                console.log('Stream');

                addVideoStream(stream, peerIdToConnect);
            });

            call.on('error', () => {
                console.log('Ocorreu um erro no call');
            }); // TODO: handle this
        },
        [],
    );

    const addVideoStream = (stream: MediaStream, peerId: string) => {
        if (!containerRef.current) return;

        if (peers.includes(peerId)) return;

        peers.push(peerId);

        console.log('Adicionando video ', stream.id);

        const video = document.createElement('video');
        video.id = peerId;
        video.srcObject = stream;
        video.muted = false; // TODO: remove this
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        containerRef.current.appendChild(video);
    };

    const removeVideoStream = useCallback(
        peerId => {
            console.log('remover', peerId);

            const video = document.getElementById(peerId);

            containerRef.current.removeChild(video);
        },
        [containerRef],
    );

    //TODO: Add self video via config video stream
    return (
        <>
            <Container ref={containerRef}></Container>
        </>
    );
}
