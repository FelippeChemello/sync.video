import { useRef, useMemo, useEffect } from 'react';
import { DailyTrackState } from '@daily-co/daily-js';
import styled from 'styled-components';

const Container = styled.div<{ isLocal: boolean }>`
    min-width: 280px;
    min-height: 157px;
    max-width: 100%;
    flex: 0 1 auto;
    border-radius: 4px;
    position: relative;

    video {
        border-radius: 4px;
        width: 100%;
        position: absolute;
        top: 0px;
        ${({ isLocal }) => (isLocal ? 'transform: scale(-1, 1);' : '')}
    }

    audio {
        visibility: hidden;
    }
`;

const Background = styled.div`
    background-color: #000000;
    border-radius: 4px;
    width: 100%;
    padding-top: 56.25%; /* Hard-coded 16:9 aspect ratio */
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
    line-height: 17px;
`;

//TODO: i18n
function getTrackUnavailableMessage(kind: string, trackState: DailyTrackState) {
    if (!trackState) return;
    switch (trackState.state) {
        case 'blocked':
            if (trackState.blocked.byPermissions) {
                return `${kind} permission denied`;
            } else if (trackState.blocked.byDeviceMissing) {
                return `${kind} device missing`;
            }
            return `${kind} blocked`;
        case 'off':
            if (trackState.off.byUser) {
                return `${kind} muted`;
            } else if (trackState.off.byBandwidth) {
                return `${kind} muted to save bandwidth`;
            }
            return `${kind} off`;
        case 'sendable':
            return `${kind} not subscribed`;
        case 'loading':
            return `${kind} loading...`;
        case 'interrupted':
            return `${kind} interrupted`;
        case 'playable':
            return null;
    }
}

type VideoProps = {
    videoTrackState?: DailyTrackState;
    audioTrackState?: DailyTrackState;
    callItem: any;
    isLocal: boolean;
};

export default function Video({
    audioTrackState,
    isLocal,
    videoTrackState,
    callItem,
}: VideoProps) {
    const videoEl = useRef(null);
    const audioEl = useRef(null);

    console.log(callItem);

    const videoTrack = useMemo(() => {
        console.log(videoTrackState);

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

    return (
        <Container isLocal={isLocal}>
            <Background />

            {videoTrack && <video autoPlay muted playsInline ref={videoEl} />}

            {!isLocal && audioTrack && (
                <audio autoPlay playsInline ref={audioEl} />
            )}

            {getUnavailableMessage()}
        </Container>
    );
}
