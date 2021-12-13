import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useReducer,
    useMemo,
} from 'react';
import DailyCo, {
    DailyCall,
    DailyEvent,
    DailyEventObjectAppMessage,
} from '@daily-co/daily-js';
import axios from 'axios';
import styled from 'styled-components';
import Router from 'next/router';

import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import { useSocketIo } from '../../hooks/Authenticated/SocketIo';

import {
    ActionType,
    CallState,
    getCallItems,
    getStreamStates,
    isLocal,
    VideoConferenceState,
} from './utils';

import Video from './Video';
import InternalMessage from './InternalMessage';
import Tray from './Tray';
import Chat from './Chat';
import api from '../../services/api';

const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
`;

const VideosContainer = styled.div`
    display: flex;
    flex-direction: column !important;
    width: 100%;
    gap: 1rem;
    flex-flow: wrap;
    justify-content: start;
    height: 100%;
    overflow: auto;
    align-items: center;

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar {
        height: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 6px;
    }

    @media (max-width: 1024px) {
        flex-direction: row !important;
    }
`;

type VideoConferenceProps = {
    partyId: string;
    ownerId: number;
    roomUrl?: string;
};

export default function VideoConference({
    partyId,
    roomUrl,
    ownerId,
}: VideoConferenceProps) {
    const [state, setState] = useState<VideoConferenceState>(
        VideoConferenceState.IDLE,
    );
    const [hasNewChatMessage, setHasNewChatMessage] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [callObject, setCallObject] = useState<DailyCall>(null);
    const [callState, setCallState] = useState<CallState>({});

    const { addToast } = useToast();
    const { socketEmit, socket } = useSocketIo();
    const { user } = useAuth();

    useEffect(() => {
        if (roomUrl && !callObject && roomUrl.length > 0) {
            startJoiningCall(roomUrl);
            return;
        }

        createCall().then(call => startJoiningCall(call.url));
    }, []);

    useEffect(() => {
        addEventListener();

        return removeEventListener;
    }, [callObject, ownerId]);

    useEffect(() => {
        if (!callObject) return;

        callObject.setUserName(`${user.name} - ${user.id}`);
    }, [callObject]);

    useEffect(() => {
        if (isChatOpen && hasNewChatMessage) {
            setHasNewChatMessage(false);
        }
    }, [isChatOpen]);

    useEffect(() => {
        if (state === VideoConferenceState.ERROR) {
            addToast({
                title: 'Erro',
                description: 'Ocorreu um erro desconhecido',
                type: 'error',
            });

            setTimeout(() => {
                Router.push('/dashboard');
            }, 1500);
            return;
        }

        if (state !== VideoConferenceState.JOINED) return;
        const peerId = callObject.participants().local.user_id;

        socketEmit('peer:ready', {
            partyId,
            peerId,
        });
    }, [state]);

    const addEventListener = () => {
        if (!callObject) return;

        handleNewMeetingState();
        updateCallState();

        const meetingEvents = [
            'joined-meeting',
            'left-meeting',
            'error',
        ] as DailyEvent[];
        meetingEvents.forEach(event => {
            callObject.on(event, handleNewMeetingState);
        });

        const participantEvents = [
            'participant-joined',
            'participant-updated',
            'participant-left',
        ] as DailyEvent[];
        participantEvents.forEach(event => {
            callObject.on(event, () => updateCallState());
        });

        callObject.on('camera-error', handleCameraErrorEvent);
    };

    const removeEventListener = () => {
        if (!callObject) return;

        const meetingEvents = [
            'joined-meeting',
            'left-meeting',
            'error',
        ] as DailyEvent[];
        meetingEvents.forEach(event => {
            callObject.off(event, handleNewMeetingState);
        });

        const participantEvents = [
            'participant-joined',
            'participant-updated',
            'participant-left',
        ] as DailyEvent[];
        participantEvents.forEach(event => {
            callObject.off(event, () => updateCallState());
        });

        callObject.off('camera-error', handleCameraErrorEvent);
    };

    const handleNewMeetingState = useCallback(() => {
        switch (callObject.meetingState()) {
            case 'joined-meeting':
                setState(VideoConferenceState.JOINED);
                break;
            case 'left-meeting':
                callObject.destroy().then(() => {
                    Router.push('/dashboard');
                });
                break;
            case 'error':
                setState(VideoConferenceState.ERROR);
                break;
            default:
                break;
        }
    }, [callObject]);

    const updateCallState = () => {
        if (!callObject) return;

        const participants = callObject.participants();

        setCallState(getCallItems(participants, ownerId));
    };

    useEffect(() => {
        updateCallState();
    }, [ownerId]);

    const handleCameraErrorEvent = event => {
        addToast({
            title: 'Camera error',
            description:
                (event && event.errorMsg && event.errorMsg.errorMsg) ||
                'Unknown',
            type: 'error',
        });
    };

    const createCall = useCallback(async () => {
        setState(VideoConferenceState.CREATING);

        try {
            const roomData = await axios.post('/api/createRoom');

            return roomData.data;
        } catch (e) {
            setState(VideoConferenceState.ERROR);
            addToast({ title: 'Falha ao criar chamada' });
            return;
        }
    }, []);

    const startJoiningCall = useCallback(async url => {
        const newCallObject = DailyCo.createCallObject();

        api.patch(`/party/${partyId}/url`, { url });

        setCallObject(newCallObject);
        setState(VideoConferenceState.JOINING);

        try {
            newCallObject.join({ url });
        } catch (e) {
            addToast({ title: 'Falha ao acessar a chamada' });
            setState(VideoConferenceState.ERROR);
        }
    }, []);

    const videos = useMemo(() => {
        return Object.entries(callState).map(([id, callItem], _, array) => {
            const quantityOfParticipant = array.length < 2 ? 2 : array.length;

            return (
                <Video
                    key={id}
                    videoTrackState={callItem.videoTrackState}
                    audioTrackState={callItem.audioTrackState}
                    isLocal={isLocal(id)}
                    quantityOfParticipants={quantityOfParticipant}
                    isOwner={callItem.isOwner}
                    userId={callItem.userId}
                    partyId={partyId}
                />
            );
        });
    }, [callState]);

    return (
        <Container>
            {state === VideoConferenceState.JOINED && (
                <>
                    <VideosContainer>{videos}</VideosContainer>

                    <Tray
                        hasNewChatMessage={hasNewChatMessage}
                        isChatOpen={isChatOpen}
                        setIsChatOpen={setIsChatOpen}
                        isEnabledButtons={state === VideoConferenceState.JOINED}
                        callObject={callObject}
                    />
                    <Chat
                        isChatOpen={isChatOpen}
                        callObject={callObject}
                        setHasNewMessage={setHasNewChatMessage}
                    />
                </>
            )}
        </Container>
    );
}
