import { useRef, useState } from 'react';
import {
    BsPlayFill,
    BsPip,
    BsFullscreen,
    BsFillPauseFill,
} from 'react-icons/bs';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

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

const Controls = styled.div`
    background-color: #00000050;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2rem;
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
    url: string;
}

interface InterfaceProgress {
    playedSeconds: number;
    played: number;
    loadedSeconds: number;
    loaded: number;
}

export default function Player({ url }: PlayerProps) {
    const playerRef = useRef<ReactPlayer>(null);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [progress, setProgess] = useState<InterfaceProgress>({
        loaded: 0,
        loadedSeconds: 0,
        played: 0,
        playedSeconds: 0,
    });

    return (
        <Container>
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                onDuration={setDuration}
                onProgress={setProgess}
                onStart={() => {}} // TODO: Send event on start
                onEnded={() => {}} // TODO: Send event on end
                onPause={() => {
                    setIsPlaying(false);
                    console.log('pause');
                }} // TODO: Send pause event through socket
                onPlay={() => {
                    setIsPlaying(true);
                    console.log('play');
                }} // TODO: Send play event through socket
                muted={true} // TODO: remove this
                onSeek={data => console.warn(data)}
                loop={false}
                playbackRate={playbackRate}
                style={{
                    flex: 1,
                }}

                // TODO: Setup PIP (remember to stopOnUnmount)
                // TODO: Sync playback and progress with Socket
            />
            <Controls>
                <PlayButton>
                    {isPlaying ? (
                        <BsFillPauseFill onClick={() => setIsPlaying(false)} />
                    ) : (
                        <BsPlayFill onClick={() => setIsPlaying(true)} />
                    )}
                </PlayButton>
                <SeekBarContainer>
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
                    <BsPip />
                </OptionButton>
                <OptionButton>
                    <BsFullscreen />
                </OptionButton>
            </Controls>
        </Container>
    );
}
