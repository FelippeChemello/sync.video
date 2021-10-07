import { useState, useEffect, useRef, MouseEvent, useMemo } from 'react';
import {
    BsFillVolumeMuteFill,
    BsFillVolumeDownFill,
    BsFillVolumeUpFill,
} from 'react-icons/bs';
import styled from 'styled-components';

import isTouchDevice from '../../utils/isTouchDevice';

const Container = styled.div<InterfaceContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: ${props => (props.isDragging ? 7 : 2)}rem;
    flex: 1;
    margin: 0 0 0 0.5rem;
    padding: 0.3rem;
    cursor: pointer;

    transition: width ease-in-out 0.35s;

    &:hover {
        width: ${props => (props.isDisabledChangeWidth ? 2 : 7)}rem;
    }

    svg {
        color: #fff;
        height: 100%;
        width: 100%;
        /* flex: 1; */
    }
`;

const SlideBar = styled.div<InterfaceSlideBarProps>`
    position: relative;
    left: 0;
    height: 0.3rem;
    border-radius: 4px;
    background-color: #ffffff30;
    opacity: ${props =>
        props.isShowingBar && !props.isDisabledChangeWidth ? '1' : '0'};
    width: ${props =>
        props.isShowingBar && !props.isDisabledChangeWidth ? '7rem' : '0'};
    transition: width ease-in-out 0.35s, opacity ease-in-out 0.25s;
`;

const CurrentVolume = styled.div`
    background: #fff;
    border-radius: 4px;
    height: 100%;
    position: absolute;
    left: 0;
`;

const Button = styled.div`
    position: absolute;
    height: 0.55rem;
    width: 0.55rem;
    margin-top: -4px;
    margin-left: -4px;
    display: block;
    background: #fff;
    border-radius: 50%;
    top: 50%;
`;

interface InterfaceContainerProps {
    isDragging: boolean;
    isDisabledChangeWidth: boolean;
}

interface InterfaceSlideBarProps {
    isDisabledChangeWidth: boolean;
    isShowingBar: boolean;
}

interface InterfaceVolumeBarProps {
    volume: number;
    setVolume: (volume: number) => void;
    isSeeking: boolean;
}

export default function VolumeBar({
    setVolume,
    volume,
    isSeeking,
}: InterfaceVolumeBarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const [isShowingBar, setIsShowingBar] = useState(false);
    const [barWidth, setBarWidth] = useState(0);
    const [isTouch, setIsTouch] = useState(false);
    const [leftOffset, setLeftOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [volumeBeforeMute, setVolumeBeforeMute] = useState(volume);

    useEffect(() => {
        setIsTouch(isTouchDevice());

        window.addEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setTimeout(handleResize, 350);
    }, [barRef, isShowingBar]);

    const VolumeIcon = useMemo(() => {
        if (volume === 0) {
            return BsFillVolumeMuteFill;
        } else if (volume < 0.5) {
            return BsFillVolumeDownFill;
        } else {
            return BsFillVolumeUpFill;
        }
    }, [volume]);

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

        setVolume(percentage);
    };

    const endEvent = e => {
        e.preventDefault();

        setIsDragging(false);

        document.ontouchmove = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
    };

    const startEvent = () => {
        setIsDragging(true);

        document.ontouchmove = moveEvent;
        document.ontouchend = endEvent;
        document.onmousemove = moveEvent;
        document.onmouseup = endEvent;
    };

    const seekToPosition = (event: MouseEvent<HTMLDivElement>) => {
        if (!barRef.current) return;

        let position = event.pageX - leftOffset;
        if (position < 0) {
            position = 0;
        } else if (position > barWidth) {
            position = barWidth;
        }

        const percentage = position / barWidth;

        setVolume(percentage);
    };

    const handleMute = () => {
        if (volume === 0) {
            setVolume(volumeBeforeMute);
            return;
        }

        setVolumeBeforeMute(volume);
        setVolume(0);
    };

    return (
        <Container
            onMouseEnter={() => setIsShowingBar(true)}
            onMouseLeave={() => !isDragging && setIsShowingBar(false)}
            isDragging={isDragging}
            isDisabledChangeWidth={isSeeking}
        >
            <VolumeIcon onClick={handleMute} />
            <SlideBar
                isShowingBar={isShowingBar}
                isDisabledChangeWidth={isSeeking}
                ref={barRef}
                onClick={isTouch ? null : seekToPosition}
            >
                <CurrentVolume
                    style={{
                        width: `${volume * 100}%`,
                    }}
                />
                <Button
                    onMouseDown={startEvent}
                    onTouchStart={startEvent}
                    style={{
                        left: `${volume * 100}%`,
                    }}
                />
            </SlideBar>
        </Container>
    );
}
