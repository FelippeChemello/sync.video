import {
    DailyEventObjectAppMessage,
    DailyCall,
    DailyParticipantsObject,
} from '@daily-co/daily-js';
import { useState, useEffect, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';
import { BiSend } from 'react-icons/bi';

const ChatContainer = styled.div<{ isOpen: boolean }>`
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: absolute;
    bottom: 3.5rem;
    right: 1rem;
    width: max(50%, 250px);
    min-height: 200px;
    max-height: 50%;
    background-color: #131b27;
    border-radius: 0.5rem;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
`;

const Messages = styled.div`
    color: #fff;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 0.5rem;
    flex: 1;

    p,
    strong {
        font-family: 'Open Sans', sans-serif !important;
        margin: 0;
        word-break: break-word;
    }

    strong {
        font-weight: bold;
    }

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 6px;
    }
`;

const Message = styled.div<{ isMe: boolean }>`
    background-color: ${props => (props.isMe ? '#113b4c' : '#105165')};
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    position: relative;

    ${props =>
        props.isMe
            ? css`
                  &:after {
                      content: ' ';
                      position: absolute;
                      width: 0;
                      height: 0;
                      left: auto;
                      right: 0px;
                      bottom: -8px;
                      border: 8px solid;
                      border-color: #113b4c #113b4c transparent transparent;
                  }
              `
            : css`
                  &:after {
                      content: ' ';
                      position: absolute;
                      width: 0;
                      height: 0;
                      right: auto;
                      left: 0px;
                      bottom: -8px;
                      border: 8px solid;
                      border-color: #105165 transparent transparent #105165;
                  }
              `}
`;

const Input = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    height: 3rem;
    margin-right: 1rem;

    input {
        flex: 1;
        outline: none;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: #c3dae3;
        border: none;
    }

    svg {
        color: #fff;
        width: 1.5rem;
        height: 1.5rem;

        &:hover {
            color: #ffffff90;
        }
    }
`;

type ChatProps = {
    isChatOpen: boolean;
    callObject: DailyCall;
    setHasNewMessage: (hasNewMessage: boolean) => void;
};

type ChatMessage = {
    sender: string;
    message: string;
};

export default function Chat({
    isChatOpen,
    callObject,
    setHasNewMessage,
}: ChatProps) {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [me, setMe] = useState('');
    const [participants, setParticipants] = useState<DailyParticipantsObject>();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleChatMessage = (event: DailyEventObjectAppMessage) => {
        console.log('event');

        if (!event) return;

        const sender = participants[event.fromId].user_name
            ? participants[event.fromId].user_name
            : participants[event.fromId].user_id;

        setChatHistory([
            ...chatHistory,
            {
                sender,
                message: event.data.data,
            },
        ]);

        if (!isChatOpen) setHasNewMessage(true);
    };

    const handleSubmit = event => {
        event.preventDefault();

        console.log('Sending message: ', inputValue);

        callObject.sendAppMessage({ type: 'message', data: inputValue }, '*');

        setChatHistory([
            ...chatHistory,
            {
                sender: me,
                message: inputValue,
            },
        ]);

        setInputValue('');
    };

    useEffect(() => {
        console.log('scroll');

        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    useEffect(() => {
        if (!callObject) return;

        setParticipants(callObject.participants());

        addEventListeners();

        return removeEventListeners;
    }, [callObject, handleChatMessage]);

    useEffect(() => {
        if (!participants) return;

        setMe(participants.local.user_name ?? participants.local.user_id);
    }, [participants]);

    const addEventListeners = useCallback(() => {
        callObject.on('app-message', handleChatMessage);
    }, [callObject, handleChatMessage]);

    const removeEventListeners = useCallback(() => {
        callObject.off('app-message', handleChatMessage);
    }, [callObject, handleChatMessage]);

    useEffect(() => {}, [chatHistory]);

    // TODO: i18n
    return (
        <ChatContainer isOpen={isChatOpen}>
            <Messages>
                {chatHistory.map((entry, index) => (
                    <Message key={`chat-${index}`} isMe={entry.sender === me}>
                        <p>
                            <strong>{entry.sender}</strong>:
                        </p>
                        <p>{entry.message}</p>
                    </Message>
                ))}
                <div ref={chatEndRef}></div>
            </Messages>
            <Input>
                <input
                    type="text"
                    placeholder="Type your message here.."
                    value={inputValue}
                    onChange={event => setInputValue(event.target.value)}
                />
                <BiSend onClick={handleSubmit}>Send</BiSend>
            </Input>
        </ChatContainer>
    );
}
