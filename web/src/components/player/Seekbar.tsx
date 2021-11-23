import {
    useState,
    useEffect,
    useRef,
    MouseEvent,
    TouchEvent,
    useMemo,
    useCallback,
} from 'react';
import { intervalToDuration } from 'date-fns';
import styled from 'styled-components';

import isTouchDevice from '../../utils/isTouchDevice';

const Container = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 5px;
    display: flex;
    align-items: center;

    > p {
        color: #fff;
        font-size: 0.9rem;
        flex: 1;
        display: contents;
        white-space: nowrap;
        margin-right: 1rem;
        font-family: NS;
    }
`;

const Bar = styled.div`
    width: 100%;
    position: relative;
    cursor: pointer;
    height: 0.3rem;
    border-radius: 4px;
    background-color: #ffffff30;
    margin-left: 1rem;
`;

const Loaded = styled.div`
    background: #aaa;
    height: 4px;
    position: absolute;
    border-radius: 5px;
    left: 0;

    transition: width 0.3s ease-in-out;
`;

const Played = styled.div`
    background: #fff;
    height: 4px;
    position: absolute;
    border-radius: 5px;
    left: 0;

    transition: width 0.3s ease-in-out;
`;

const Button = styled.div`
    position: absolute;
    height: 12px;
    width: 12px;
    margin-top: -6px;
    margin-left: -5px;
    display: block;
    background: #fff;
    border-radius: 50%;
    top: 50%;

    transition: left 0.3s ease-in-out;
`;

interface InterfaceSeekBarProps {
    loadedPercentage: number;
    playedPercentage: number;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    setIsSeeking: (isSeeking: boolean) => void;
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
    setIsSeeking,
}: InterfaceSeekBarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const [barWidth, setBarWidth] = useState(0);
    const [isTouch, setIsTouch] = useState(false);
    const [leftOffset, setLeftOffset] = useState(0);
    const [percentageBeforeSeek, setPercentageBeforeSeek] =
        useState<number>(-1);
    const [percentageAfterSeek, setPercentageAfterSeek] = useState<number>(-1);
    const [pausedBeforeSeek, setPausedBeforeSeek] = useState(false);
    const [formattedDuration, setFormattedDuration] = useState('00:00');

    // TODO: Test seek with touch

    useEffect(() => {
        setIsTouch(isTouchDevice());

        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleResize();
    }, [barRef]);

    useEffect(() => {
        setFormattedDuration(formatSecondsToMinutes(duration));

        handleResize();
    }, [duration]);

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

        setIsSeeking(false);

        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
    };

    const startEvent = () => {
        setPausedBeforeSeek(!isPlaying);

        pause();

        setIsSeeking(true);

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

    const formatSecondsToMinutes = useCallback(
        (timeInSeconds: number) => {
            if (timeInSeconds <= 0) return '00:00';

            const seconds = Math.abs(Math.floor(timeInSeconds) % 60)
                .toString()
                .padStart(2, '0');
            const minutes = Math.abs(Math.floor(timeInSeconds / 60) % 60)
                .toString()
                .padStart(2, '0');
            const hours = Math.abs(Math.floor(timeInSeconds / 60 / 60))
                .toString()
                .padStart(2, '0');

            if (duration >= 3600) return `${hours}:${minutes}:${seconds}`;

            return `${minutes}:${seconds}`;
        },
        [duration],
    );

    return (
        <Container>
            <p>
                {formatSecondsToMinutes(currentTime)} / {formattedDuration}
            </p>

            <Bar ref={barRef} onClick={isTouch ? null : seekToPosition}>
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
                />
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
                />
            </Bar>
        </Container>
    );
}
