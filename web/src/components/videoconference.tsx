import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import { useConfig } from '../hooks/Authenticated/Config';
import { usePeerJs } from '../hooks/Authenticated/PeerJs';
import { useSocketIo } from '../hooks/Authenticated/SocketIo';
import sleep from '../utils/sleep';

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
    partyId: string;
};

export default function VideoConference({ partyId }: VideoConferenceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const peers = useRef<string[]>([]);

    const { webcamStream } = useConfig();
    const { socketAddListener, socketEmit } = useSocketIo();
    const { peer } = usePeerJs();

    useEffect(() => {
        addVideoStream(webcamStream.current, peer.id);

        socketAddListener('peer:joined', (joinedPeerId: string) => {
            console.log(`Adding ${joinedPeerId}`);
            addPeer(joinedPeerId);
        });

        socketAddListener('peer:leave', (leftPeerId: string) => {
            console.log(`Removing ${leftPeerId}`);
            removeVideoStream(leftPeerId);
        });

        peer.on('call', call => {
            call.answer(webcamStream.current);

            call.on('stream', (remoteStream: MediaStream) => {
                addVideoStream(remoteStream, call.peer);
            });
        });

        socketEmit('peer:ready', { partyId, peerId: peer.id });
    }, []);

    useEffect(() => {}, []);

    const addPeer = (peerIdToConnect: string) => {
        const call = peer.call(peerIdToConnect, webcamStream.current);

        call.on('open', () =>
            console.log(`connection opened with ${peerIdToConnect}`),
        );

        call.on('stream', (remoteStream: MediaStream) => {
            addVideoStream(remoteStream, call.peer);
        });
    };

    const addVideoStream = async (stream: MediaStream, peerId: string) => {
        await waitForContainer();

        if (peers.current.includes(peerId)) return;

        console.log(`Added ${peerId}`, stream);
        peers.current.push(peerId);

        const video = document.createElement('video');
        video.id = peerId;
        video.srcObject = stream;
        video.autoplay = true;

        video.addEventListener('loadedmetadata', () => {
            video.play();
        });

        containerRef.current.appendChild(video);
    };

    const removeVideoStream = async (peerId: string) => {
        await waitForContainer();

        const video = document.getElementById(peerId);

        containerRef.current.removeChild(video);
    };

    const waitForContainer = async () => {
        while (!containerRef?.current) {
            await sleep(100);
        }
    };

    return (
        <>
            <Container ref={containerRef}></Container>
        </>
    );
}
