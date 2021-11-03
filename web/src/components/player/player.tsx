import { useRef, useState, useEffect, useCallback } from 'react';
import {
    BsPlayFill,
    BsPip,
    BsFullscreen,
    BsFillPauseFill,
    BsGearFill,
} from 'react-icons/bs';
import { MdOpenInBrowser, MdOndemandVideo } from 'react-icons/md';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

import { useConfig } from '../../hooks/Config';

import SeekBar from './Seekbar';
import VolumeBar from './Volumebar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const TopBar = styled.div`
    background-color: #00000050;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    width: 100%;
    height: 2.5rem;

    font-family: NS;

    > div {
        height: 100%;
    }

    svg {
        padding: 0.5rem;
        color: #fff;
        height: 100%;
        width: 100%;
    }
`;

const Url = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 1.2rem;
    color: #fff;
    gap: 0.5rem;

    svg {
        width: unset;
    }

    input {
        font-family: 'NS';
        font-size: 1.05rem;
        background-color: #00000000;
        outline: none;
        border: none;
        flex: 1;
        height: 100%;
        color: #ffffff50;

        &:focus {
            color: #ffffff;
        }
    }
`;

const Controls = styled.div`
    background-color: #00000050;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
`;

const PlayButton = styled.div`
    height: 100%;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        color: #fff;
        height: 100%;
        width: 100%;
    }
`;

const OptionButton = styled.div`
    height: 100%;
    width: 2rem;
    margin: 0 0.5rem;
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        color: #fff;
        height: 100%;
        width: 100%;
    }
`;

const VolumeContainer = styled.div`
    height: 100%;
    width: auto;
`;

const SeekBarContainer = styled.div`
    flex: 1;
    height: 100%;
`;

interface PlayerProps {
    socket: Socket;
    partyMode: 'passive' | 'active';
    partyId: string;
    url?: string;
    currentTime?: number;
    videoId?: number;
}

export default function Player({
    socket,
    partyMode,
    partyId,
    url: playingUrl,
    currentTime: currentTimeOnLoadPartyData,
    videoId: videoIdOnLoadPartyData,
}: PlayerProps) {
    const playerRef = useRef<ReactPlayer>(null);
    const [url, setUrl] = useState<string>(playingUrl);
    const [videoId, setVideoId] = useState<number>(videoIdOnLoadPartyData || 0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const [canPip, setCanPip] = useState(false);
    const [progress, setProgress] = useState<InterfaceProgress>({
        loaded: 0,
        loadedSeconds: 0,
        played: 0,
        playedSeconds: 0,
    });

    const { handleConfigModal } = useConfig();

    useEffect(() => {
        handleSocketPlayerEvents();
    }, [socket, partyMode, playerRef]);

    useEffect(() => {
        setCanPip(ReactPlayer.canEnablePIP(url));
    }, [url]);

    useEffect(() => {
        console.log('currentTimeOnLoadPartyData', currentTimeOnLoadPartyData);

        if (currentTimeOnLoadPartyData) {
            playerRef.current.seekTo(currentTimeOnLoadPartyData);
        }
    }, [currentTimeOnLoadPartyData]);

    const handleSocketPlayerEvents = useCallback(() => {
        if (!socket) return;

        if (socket.hasListeners('player:ready')) socket.off('player:ready');
        socket.on('player:ready', ({ second, url, id }: InterfaceVideo) => {
            setVideoId(id);

            if (partyMode === 'active') return;

            setUrl(url);

            if (!playerRef.current) return;

            playerRef.current.seekTo(second);
            setDuration(playerRef.current.getDuration());
        });
    }, [socket, playerRef, partyMode]);

    if (socket.hasListeners('player:updateState'))
        socket.off('player:updateState');
    socket.on(
        'player:updateState',
        ({
            second,
            isPlaying: socketIsPlaying,
            playbackRate: socketPlaybackRate,
        }: InterfaceVideo) => {
            if (partyMode === 'active') return;

            console.log('receive update');

            setIsPlaying(socketIsPlaying);
            setPlaybackRate(socketPlaybackRate);

            if (!playerRef.current) return;

            const diffInSecondsFromOwner = Math.abs(
                Math.floor(second - progress.playedSeconds),
            );

            if (diffInSecondsFromOwner >= 1) {
                // TODO: Add another types of sync (via playback rate and calculating latency, then disregard it [EXPERIMENTAL])
                playerRef.current.seekTo(second);
            }
        },
    );

    const handlePlayPause = (toState: 'play' | 'pause') => {
        console.log(toState);

        if (partyMode === 'passive') return;

        setIsPlaying(toState === 'play');

        console.log('Send update');

        socket.emit('player:updateState', {
            partyId,
            isPlaying: toState === 'play',
            playbackRate,
            currentTime: progress.playedSeconds,
            videoId,
        });
    };

    const handleProgress = (progressData: InterfaceProgress) => {
        setProgress(progressData);

        if (partyMode === 'passive') return;

        console.log('Send update');

        socket.emit('player:updateState', {
            partyId,
            isPlaying,
            playbackRate,
            currentTime: progressData.playedSeconds,
            videoId,
        });
    };

    return (
        <Container>
            <TopBar>
                <Url>
                    {partyMode === 'active' ? (
                        <MdOpenInBrowser
                            width="16"
                            // TODO: On Click open modal and upload file via p2p
                        />
                    ) : (
                        <MdOndemandVideo width="16" />
                    )}
                    <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder={
                            partyMode === 'active' // TODO: i18n
                                ? 'Enter video URL here or click on Icon to upload your file'
                                : 'Waiting for party owner to input video'
                        }
                        disabled={partyMode === 'passive'}
                        readOnly={partyMode === 'passive'}
                    />
                </Url>
                <div>
                    <BsGearFill onClick={handleConfigModal} />
                </div>
            </TopBar>
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                onDuration={setDuration}
                onProgress={handleProgress}
                onStart={() => handlePlayPause('play')}
                onReady={() => {
                    if (partyMode === 'passive') return;

                    socket.emit('player:ready', {
                        url, // TODO: make it work with file
                        partyId,
                    });
                }}
                onPlay={() => handlePlayPause('play')}
                onPause={() => handlePlayPause('pause')}
                muted={true} // TODO: remove this
                onSeek={data => console.warn(data)} // TODO: Remove this line, it isn't doing nothing and send seek event through socket
                loop={false}
                playbackRate={playbackRate}
                pip={isPip}
                style={{
                    flex: 1,
                    pointerEvents: partyMode === 'passive' ? 'none' : 'all',
                }}

                // TODO: Sync playback and progress with Socket
                // TODO: Show image when without url (or when url is not valid)
                // TODO: Test file play/pause clicking on video
                // TODO: Add button to change playback
                // TODO: When buffer of someone is low than 5 seconds, stop all participant while it get 20 seconds
            />
            <Controls>
                <PlayButton
                    style={{
                        pointerEvents: partyMode === 'passive' ? 'none' : 'all',
                    }}
                >
                    {isPlaying ? (
                        <BsFillPauseFill onClick={() => setIsPlaying(false)} />
                    ) : (
                        <BsPlayFill onClick={() => setIsPlaying(true)} />
                    )}
                </PlayButton>
                <SeekBarContainer
                    style={{
                        pointerEvents: partyMode === 'passive' ? 'none' : 'all',
                    }}
                >
                    <SeekBar
                        loadedPercentage={progress.loaded}
                        playedPercentage={progress.played}
                        duration={duration}
                        currentTime={progress.playedSeconds}
                        seekTo={playerRef.current?.seekTo}
                        play={() => setIsPlaying(true)}
                        pause={() => setIsPlaying(false)}
                        isPlaying={isPlaying}
                        setIsSeeking={setIsSeeking}
                    />
                </SeekBarContainer>
                <VolumeContainer>
                    <VolumeBar
                        setVolume={setVolume}
                        volume={volume}
                        isSeeking={isSeeking}
                    />
                </VolumeContainer>
                {canPip && ( // TODO: Adicionar nas configurações opção para habilitar possibilidade de PIP e informar alerta que, quando ativado e não for owner, pode ocorrer situações inesperadas, como não pausar ou trancar reprodução - FEATURE EXPERIMENTAL
                    <OptionButton>
                        <BsPip onClick={() => setIsPip(!isPip)} />
                    </OptionButton>
                )}
                <OptionButton>
                    <BsFullscreen />
                </OptionButton>
            </Controls>
        </Container>
    );
}
