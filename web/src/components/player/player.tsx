import { useEffect } from 'hoist-non-react-statics/node_modules/@types/react';
import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import SeekBar from './Seekbar';

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const Controls = styled.div`
    position: absolute;
    bottom: 0;

    box-shadow: 0px -90px 90px -20px rgba(0, 0, 0) inset;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1.5rem 3.5rem;
    width: 100%;

    transition: opacity 0.15s;

    > div {
        width: 100%;
        display: flex;
    }
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
    const [isShowingControls, setIsShowingControls] = useState(true);
    const [hasEnded, setHasEnded] = useState(false); // TODO: Should sync with socket and reset when change media
    const [hasStarted, setHasStarted] = useState(false); // TODO: Should sync with socket and reset when change media
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgess] = useState<InterfaceProgress>({
        loaded: 0,
        loadedSeconds: 0,
        played: 0,
        playedSeconds: 0,
    });

    const handleShowControls = (shouldShow: boolean) => {
        if (hasEnded) {
            setIsShowingControls(false);
            return;
        }

        console.log(hasStarted, isPlaying);
        if (!hasStarted || !isPlaying) {
            setIsShowingControls(true);

            return;
        }

        setIsShowingControls(shouldShow);
    };

    return (
        <Container
            onMouseLeave={() => handleShowControls(false)}
            onMouseEnter={() => handleShowControls(true)}
        >
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="99%"
                height="99%"
                playing={isPlaying}
                onDuration={setDuration}
                onProgress={setProgess}
                onStart={() => {
                    setHasStarted(true);
                    handleShowControls(false);
                }}
                onEnded={() => {
                    setHasEnded(true);
                    handleShowControls(false);
                }}
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

                // TODO: Setup PIP (remember to stopOnUnmount)
                // TODO: Sync playback and progress with Socket
            />
            <Controls
                style={{
                    visibility: isShowingControls ? 'visible' : 'hidden',
                    opacity: isShowingControls ? 1 : 0,
                }}
            >
                <div>
                    <SeekBar
                        loadedPercentage={progress.loaded}
                        playedPercentage={progress.played}
                        duration={duration}
                        currentTime={progress.playedSeconds}
                        seekTo={playerRef.current?.seekTo}
                        play={() => setIsPlaying(true)}
                        pause={() => setIsPlaying(false)}
                        isPlaying={isPlaying}
                    />
                </div>
                <div></div>
            </Controls>
        </Container>
    );
}
