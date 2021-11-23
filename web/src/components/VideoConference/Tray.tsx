import styled from 'styled-components';
import {
    BsMicFill,
    BsMicMuteFill,
    BsCameraVideoFill,
    BsCameraVideoOffFill,
    BsChatRightFill,
} from 'react-icons/bs';
import { DailyCall } from '@daily-co/daily-js';
import { useState } from 'react';

const Container = styled.div<{ isEnabledButtons: boolean }>`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 3rem;
    padding-top: 0.5rem;
    border-top: 2px solid #00000070;

    button {
        width: 2.5rem;
        height: 2.5rem;
        background: none;
        outline: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        position: relative;

        span {
            position: absolute;
            background: #ff772f;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            right: 0;
            top: 0;
        }

        svg {
            color: #fff;
            width: 100%;
            height: 100%;

            &:hover {
                color: #ffffff90;
            }
        }
    }
`;

type TrayProps = {
    setIsChatOpen: (isOpen: boolean) => void;
    isChatOpen: boolean;
    hasNewChatMessage: boolean;
    isEnabledButtons: boolean;
    callObject: DailyCall;
};

export default function Tray({
    hasNewChatMessage,
    isEnabledButtons,
    isChatOpen,
    setIsChatOpen,
    callObject,
}: TrayProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(true);
    const [isMicrophoneOpen, setIsMicrophoneOpen] = useState(true);

    function toggleCamera() {
        const newState = !isCameraOpen;
        setIsCameraOpen(newState);

        callObject.setLocalVideo(newState);
    }

    function toggleMic() {
        const newState = !isMicrophoneOpen;
        setIsMicrophoneOpen(newState);

        callObject.setLocalAudio(newState);
    }

    function toggleChat() {
        setIsChatOpen(!isChatOpen);
    }

    return (
        <Container isEnabledButtons={isEnabledButtons}>
            <button onClick={toggleCamera}>
                {isCameraOpen ? (
                    <BsCameraVideoFill />
                ) : (
                    <BsCameraVideoOffFill />
                )}
            </button>
            <button onClick={toggleMic}>
                {isMicrophoneOpen ? <BsMicFill /> : <BsMicMuteFill />}
            </button>
            <button onClick={toggleChat}>
                <BsChatRightFill />
                {hasNewChatMessage && <span>!</span>}
            </button>
        </Container>
    );
}
