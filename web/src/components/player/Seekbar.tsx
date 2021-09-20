import { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import styled from 'styled-components';
// import videoStyles from './video.css';

import isTouchDevice from '../../utils/isTouchDevice';

const Container = styled.div`
    flex: 1;
    background: rgb(58, 61, 80);
    height: 4px;
    position: relative;
    border-radius: 5px;
    cursor: pointer;
`;

const Loaded = styled.div`
    background: #ccc;
    height: 4px;
    position: absolute;
    border-radius: 5px;
    left: 0;
`;

const Played = styled.div`
    background: rgb(0, 125, 255);
    height: 4px;
    position: absolute;
    border-radius: 5px;
    left: 0;
`;

const Button = styled.div`
    position: absolute;
    height: 15px;
    width: 15px;
    margin-top: -7.5px;
    margin-left: -7.5px;
    display: block;
    background: rgb(0, 125, 255);
    border-radius: 50%;
    top: 50%;

    span {
        display: block;
        padding: 0px 30px 30px 30px;
        left: 50%;
        margin-left: -30px;
        position: absolute;
    }
`;

interface InterfaceSeekBarProps {
    loadedPercentage: number;
    playedPercentage: number;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    seekTo: (time: number, type: 'seconds' | 'fraction') => void;
    play: () => void;
    pause: () => void;
}

export default function SeekBar({
    loadedPercentage,
    playedPercentage,
    currentTime,
    duration,
    seekTo,
    pause,
    play,
    isPlaying,
}: InterfaceSeekBarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const [barWidth, setBarWidth] = useState(0);
    const [isTouch, setIsTouch] = useState(false);
    const [leftOffset, setLeftOffset] = useState(0);
    const [percentageBeforeSeek, setPercentageBeforeSeek] =
        useState<number>(-1);
    const [percentageAfterSeek, setPercentageAfterSeek] = useState<number>(-1);
    const [pausedBeforeSeek, setPausedBeforeSeek] = useState(false);

    // TODO: Test seek with touch

    useEffect(() => {
        setIsTouch(isTouchDevice());

        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleResize();
    }, [barRef]);

    useEffect(() => {
        if (percentageAfterSeek < 0) return;

        if (playedPercentage !== percentageBeforeSeek) {
            setPercentageBeforeSeek(-1);
            setPercentageAfterSeek(-1);
        }
    }, [playedPercentage]);

    const handleResize = () => {
        if (!barRef.current) return;

        setLeftOffset(barRef.current.getBoundingClientRect().left);
        setBarWidth(barRef.current.offsetWidth);
    };

    const moveEvent = (event: any): any => {
        event.preventDefault();

        let position =
            event.type === 'touchmove'
                ? event.touches[0].pageX - leftOffset
                : event.pageX - leftOffset;

        if (position < 0) {
            position = 0;
        } else if (position > barWidth) {
            position = barWidth;
        }

        const percentage = position / barWidth;

        setPercentageAfterSeek(percentage);
    };

    const endEvent = e => {
        e.preventDefault();

        if (!pausedBeforeSeek) {
            play();
        }

        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
    };

    const startEvent = () => {
        setPausedBeforeSeek(!isPlaying);

        pause();

        setPercentageBeforeSeek(playedPercentage);

        document.ontouchmove = moveEvent;
        document.ontouchend = endEvent;
        document.onmousemove = moveEvent;
        document.onmouseup = endEvent;
    };

    const seekToPosition = (event: MouseEvent<HTMLDivElement>) => {
        if (!barRef.current) return;

        setPercentageBeforeSeek(playedPercentage);

        let position = event.pageX - leftOffset;
        if (position < 0) {
            position = 0;
        } else if (position > barWidth) {
            position = barWidth;
        }

        const percentage = position / barWidth;

        setPercentageAfterSeek(percentage);

        seekTo(percentage, 'fraction');
    };

    return (
        <Container ref={barRef} onClick={isTouch ? null : seekToPosition}>
            <Loaded
                style={{
                    width: `${loadedPercentage * 100}%`,
                }}
            />

            <Played
                style={{
                    width: `${
                        (percentageAfterSeek >= 0
                            ? percentageAfterSeek
                            : playedPercentage) * 100
                    }%`,
                }}
            ></Played>

            <Button
                onMouseDown={startEvent}
                onTouchStart={startEvent}
                style={{
                    left: `${
                        (percentageAfterSeek >= 0
                            ? percentageAfterSeek
                            : playedPercentage) * 100
                    }%`,
                }}
            >
                <span />
            </Button>
        </Container>
    );
}
