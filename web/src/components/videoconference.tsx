import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import Webcam from './webcam';

const Container = styled.div`
    position: relative;
    width: 100%;
    margin: 20px;
    margin: 0 auto;

    video {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        height: auto;
        visibility: hidden;
    }

    canvas {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        transform: scaleX(-1);
        background-size: cover;
    }
`;

type VideoConferenceProps = {
    peer: any;
    socket: Socket;
};

export default function VideoConference({
    peer,
    socket,
}: VideoConferenceProps) {
    //TODO: https://github.com/capelaum/ZoomClone/blob/3c4cca7639e387d1ad574e2fc457033bda8c3bff/public/pages/room/src/business.js#L107
    const containerRef = useRef<HTMLDivElement>(null);
    const [webcamStream, setWebcamStream] = useState<MediaStream | undefined>();

    useEffect(() => {
        if (!webcamStream) return;

        if (socket.hasListeners('party:userJoined')) {
            socket.off('party:userJoined');
        }

        console.log('peer', peer);

        peer.on('open', () => console.log('Opened'));

        peer.on('connection', dataConn => {
            console.log('dataConn', dataConn);

            dataConn.on('data', data => console.log('data', data));
        });

        socket.on('party:userJoined', (joinedPeerId: String) => {
            console.log('joinedPeerId', joinedPeerId, webcamStream);

            const conn = peer.connect(joinedPeerId);
            conn.on('open', () => {
                console.log('open', conn);

                conn.send('hi!');
            });

            conn.on('error', error => {
                console.log('ERROR: ', error);
            });

            conn.on('data', data => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on('open', () => {
                console.log('open 2');

                conn.send('hello!');
            });

            peer.on('connection', conn => {});
        });
    }, [socket, peer, webcamStream]);

    const addVideoStream = useCallback(
        (stream: MediaStream) => {
            console.log('Adicionando video ' + stream.id);

            if (!containerRef.current) return;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.muted = true; // TODO: remove this
            video.play();
            containerRef.current.appendChild(video);
        },
        [containerRef],
    );

    return (
        <>
            <Container ref={containerRef}>
                <Webcam setWebcamStream={setWebcamStream} />
            </Container>
        </>
    );
}
