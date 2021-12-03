import { useRef, useState, useEffect, useCallback } from 'react';
import {
    BsPlayFill,
    BsFullscreen,
    BsFillPauseFill,
    BsGearFill,
} from 'react-icons/bs';
import { MdOpenInBrowser, MdOndemandVideo } from 'react-icons/md';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import { useSocketIo } from '../../hooks/Authenticated/SocketIo';
import WatchList from '../watchList';

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

const Modal = styled.div<{ isOpen: boolean }>`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #00000050;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

interface PlayerProps {
    partyId: string;
    url?: string;
    currentTime?: number;
    videoId?: number;
}

export default function Player({
    partyId,
    url: playingUrl,
    currentTime: currentTimeOnLoadPartyData,
    videoId: videoIdOnLoadPartyData,
}: PlayerProps) {
    const playerRef = useRef<ReactPlayer>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isModalWatchListOpen, setIsModalWatchListOpen] = useState(false);
    const [url, setUrl] = useState<string>(playingUrl);
    const [videoId, setVideoId] = useState<number>(videoIdOnLoadPartyData || 0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);
    const [progress, setProgress] = useState<InterfaceProgress>({
        loaded: 0,
        loadedSeconds: 0,
        played: 0,
        playedSeconds: 0,
    });

    const { socketAddListener, socketMode, socketEmit } = useSocketIo();

    useEffect(() => {
        document.querySelectorAll('video');
    }, []);

    useEffect(() => {
        if (currentTimeOnLoadPartyData) {
            playerRef.current.seekTo(currentTimeOnLoadPartyData);
        }
    }, [currentTimeOnLoadPartyData]);

    useEffect(() => {
        socketAddListener(
            'player:ready',
            ({ second, url, id }: InterfaceVideo) => {
                setVideoId(id);

                if (socketMode === 'active') return;

                setUrl(url);

                playerRef.current.seekTo(second);
                setDuration(playerRef.current.getDuration());
            },
        );

        socketAddListener(
            'player:updateState',
            ({
                second,
                isPlaying: socketIsPlaying,
                playbackRate: socketPlaybackRate,
            }: InterfaceVideo) => {
                if (socketMode === 'active') return;

                setIsPlaying(socketIsPlaying);
                setPlaybackRate(socketPlaybackRate);

                const diffInSecondsFromOwner = Math.abs(
                    Math.floor(second - progress.playedSeconds),
                );

                if (diffInSecondsFromOwner >= 1) {
                    playerRef.current.seekTo(second);
                }
            },
        );
    }, [socketMode]);

    const handlePlayPause = (toState: 'play' | 'pause') => {
        if (socketMode === 'passive') return;

        setIsPlaying(toState === 'play');

        socketEmit('player:updateState', {
            partyId,
            isPlaying: toState === 'play',
            playbackRate,
            currentTime: progress.playedSeconds,
            videoId,
        });
    };

    const handleProgress = (progressData: InterfaceProgress) => {
        setProgress(progressData);

        if (socketMode === 'passive') return;

        socketEmit('player:updateState', {
            partyId,
            isPlaying,
            playbackRate,
            currentTime: progressData.playedSeconds,
            videoId,
        });
    };

    const closeModal = event => {
        if (modalRef.current.contains(event.target)) return;

        setIsModalWatchListOpen(false);
    };

    return (
        <Container id="player">
            <Modal isOpen={isModalWatchListOpen} onClick={closeModal}>
                <WatchList
                    ref={modalRef}
                    onSelect={url => {
                        setUrl(url);
                        setIsModalWatchListOpen(false);
                    }}
                />
            </Modal>
            <TopBar>
                <Url>
                    {socketMode === 'active' ? (
                        <MdOpenInBrowser
                            width="16"
                            onClick={() => setIsModalWatchListOpen(true)}
                        />
                    ) : (
                        <MdOndemandVideo width="16" />
                    )}
                    <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder={
                            socketMode === 'active'
                                ? 'Insira um link de vídeo ou clique no ícone para enviar um vídeo'
                                : 'Aguardando o anfitrião da sala adicionar video'
                        }
                        disabled={socketMode === 'passive'}
                        readOnly={socketMode === 'passive'}
                    />
                </Url>
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
                    if (socketMode === 'passive') return;

                    socketEmit('player:ready', {
                        url, // TODO: test it with file
                        partyId,
                    });
                }}
                onPlay={() => handlePlayPause('play')}
                onPause={() => handlePlayPause('pause')}
                loop={false}
                playbackRate={playbackRate}
                style={{
                    flex: 1,
                    pointerEvents: socketMode === 'passive' ? 'none' : 'all',
                }}

                // TODO: Show image when without url (or when url is not valid)
                // TODO: Test file play/pause clicking on video (don't work with file. ex: https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4)
                // TODO: When buffer of someone is low than 5 seconds, stop all participant while it get 20 seconds
            />
            <Controls>
                <PlayButton
                    style={{
                        pointerEvents:
                            socketMode === 'passive' ? 'none' : 'all',
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
                        pointerEvents:
                            socketMode === 'passive' ? 'none' : 'all',
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
                <OptionButton>
                    <BsFullscreen />
                </OptionButton>
            </Controls>
        </Container>
    );
}
