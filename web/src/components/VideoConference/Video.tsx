import { useRef, useMemo, useEffect } from 'react';
import { DailyCall, DailyTrackState } from '@daily-co/daily-js';
import styled from 'styled-components';
import { RiVipCrownFill, RiVipCrownLine } from 'react-icons/ri';

import { useSocketIo } from '../../hooks/Authenticated/SocketIo';

const Container = styled.div<{
    isLocal: boolean;
    quantityOfParticipants: number;
}>`
    min-height: calc(
        100% /
            ${props =>
                props.quantityOfParticipants > 6
                    ? 6
                    : props.quantityOfParticipants} - 1rem
    );
    max-height: calc(
        100% /
            ${props =>
                props.quantityOfParticipants > 6
                    ? 6
                    : props.quantityOfParticipants}
    );
    width: fit-content;
    max-width: 100%;
    flex: 1;
    aspect-ratio: 12/9;
    border-radius: 4px;
    position: relative;

    .video-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 4px;

        video {
            display: block;
            min-width: 100%;
            min-height: 100%;
            height: 100%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%)
                ${({ isLocal }) => (isLocal ? 'scale(-1, 1)' : '')};
        }
    }

    svg {
        position: absolute;
        width: 32px;
        height: 32px;
        color: red;
    }

    audio {
        visibility: hidden;
    }
`;

const Background = styled.div`
    position: absolute;
    background-color: #000000;
    border-radius: 4px;
    width: 100%;
    height: 100%;
`;

const CornerMessage = styled.p`
    position: absolute;
    color: #ffffff;
    background-color: #000000;
    padding: 10px;
    margin: 0;
    bottom: 0;
    left: 0;
    font-size: 14px;
`;

function getTrackUnavailableMessage(kind: string, trackState: DailyTrackState) {
    if (!trackState) return;
    switch (trackState.state) {
        case 'blocked':
            return `${kind} n??o encontrado`;
        case 'off':
            return `${kind} desligado`;
        case 'sendable':
            return `${kind} n??o recebido`;
        case 'loading':
            return `${kind} carregando`;
        case 'interrupted':
            return `${kind} com erro`;
        case 'playable':
            return null;
    }
}

type VideoProps = {
    videoTrackState?: DailyTrackState;
    audioTrackState?: DailyTrackState;
    isLocal: boolean;
    quantityOfParticipants: number;
    isOwner: boolean;
    userId: number;
    partyId: string;
};

export default function Video({
    audioTrackState,
    isLocal,
    videoTrackState,
    quantityOfParticipants,
    isOwner,
    userId,
    partyId,
}: VideoProps) {
    const videoEl = useRef(null);
    const audioEl = useRef(null);

    const { socketEmit, socketMode } = useSocketIo();

    const videoTrack = useMemo(() => {
        return videoTrackState && videoTrackState.state === 'playable'
            ? videoTrackState.track
            : null;
    }, [videoTrackState]);

    const audioTrack = useMemo(() => {
        return audioTrackState && audioTrackState.state === 'playable'
            ? audioTrackState.track
            : null;
    }, [audioTrackState]);

    const videoUnavailableMessage = useMemo(() => {
        return getTrackUnavailableMessage('video', videoTrackState);
    }, [videoTrackState]);

    const audioUnavailableMessage = useMemo(() => {
        return getTrackUnavailableMessage('audio', audioTrackState);
    }, [audioTrackState]);

    useEffect(() => {
        if (!videoEl.current) return;

        videoEl.current.srcObject = new MediaStream([videoTrack]);
    }, [videoTrack]);

    useEffect(() => {
        if (!audioEl.current) return;

        audioEl.current.srcObject = new MediaStream([audioTrack]);
    }, [audioTrack]);

    const getUnavailableMessage = () => {
        if (audioUnavailableMessage || videoUnavailableMessage) {
            return (
                <CornerMessage>
                    {audioUnavailableMessage}
                    {audioUnavailableMessage && videoUnavailableMessage && (
                        <br />
                    )}
                    {videoUnavailableMessage}
                </CornerMessage>
            );
        }
    };

    const transferOwner = (toUserId: number) => {
        socketEmit('party:changeOwner', { partyId, newOwnerId: toUserId });
    };

    return (
        <Container
            isLocal={isLocal}
            quantityOfParticipants={quantityOfParticipants}
        >
            <Background />
            <div className="video-wrapper">
                {videoTrack && (
                    <video autoPlay muted playsInline ref={videoEl} />
                )}
            </div>
            {!isLocal && audioTrack && (
                <audio autoPlay playsInline ref={audioEl} />
            )}

            {socketMode === 'active' ? (
                isOwner ? (
                    <RiVipCrownFill />
                ) : (
                    <RiVipCrownLine onClick={() => transferOwner(userId)} />
                )
            ) : (
                isOwner && <RiVipCrownFill />
            )}

            {getUnavailableMessage()}
        </Container>
    );
}
