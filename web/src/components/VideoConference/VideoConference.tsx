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
    flex-direction: row;
    width: 100%;
    gap: 1rem;
    flex-flow: wrap;
    justify-content: start;
`;

type VideoConferenceProps = {
    partyId: string;
    roomUrl?: string;
};


// TODO: Handle room unavailable
export default function VideoConference({
    partyId,
    roomUrl,
}: VideoConferenceProps) {
    const [state, setState] = useState<VideoConferenceState>(
        VideoConferenceState.IDLE,
    );
    const [hasNewChatMessage, setHasNewChatMessage] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [callObject, setCallObject] = useState<DailyCall>(null);
    const [callState, setCallState] = useState<CallState>({});

    const { addToast } = useToast();
    const { socketEmit } = useSocketIo();
    const { user } = useAuth();

    useEffect(() => {
        if (roomUrl && !callObject && roomUrl.length > 0) {
            console.log('Entrando no room ', roomUrl);

            startJoiningCall(roomUrl);
            return;
        }

        console.log('Criando call');
        createCall().then(call => startJoiningCall(call.url));
    }, []);

    useEffect(() => {
        addEventListener();

        return removeEventListener;
    }, [callObject]);

    useEffect(() => {
        if (!callObject) return;

        callObject.setUserName(user.name);
    }, [callObject]);

    useEffect(() => {
        if (isChatOpen && hasNewChatMessage) {
            setHasNewChatMessage(false);
        }
    }, [isChatOpen]);

    useEffect(() => {
        if (state !== VideoConferenceState.JOINED) return;
        const peerId = callObject.participants().local.user_id;

        socketEmit('peer:ready', {
            partyId,
            peerId,
        });

        //TODO: if error redirect to dashboard
    }, [state]);

    const addEventListener = useCallback(() => {
        if (!callObject) return;

        handleNewMeetingState();
        handleNewParticipantsState();

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
            callObject.on(event, handleNewParticipantsState);
        });

        callObject.on('camera-error', handleCameraErrorEvent);
    }, [callObject]);

    const removeEventListener = useCallback(() => {
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
            callObject.off(event, handleNewParticipantsState);
        });

        callObject.off('camera-error', handleCameraErrorEvent);
    }, [callObject]);

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

    const handleNewParticipantsState = useCallback(async () => {
        // const { isCameraClosed, isMicMuted } = getStreamStates(callObject);

        // callObject.setLocalVideo(isCameraClosed);
        // callObject.setLocalAudio(isMicMuted);

        const participants = callObject.participants();

        setCallState(getCallItems(participants));
    }, [callObject]);

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
            addToast({ title: 'Failed at creating call' }); //TODO: i18n
            return;
        }
    }, []);

    const startJoiningCall = useCallback(async url => {
        const newCallObject = DailyCo.createCallObject();

        api.patch(`/party/${partyId}/url`, { url });

        setCallObject(newCallObject);
        setState(VideoConferenceState.JOINING);

        console.log(url);

        newCallObject.join({ url });
    }, []);

    const videos = useMemo(() => {
        return Object.entries(callState).map(([id, callItem]) => {
            return (
                <Video
                    key={id}
                    callItem={callItem}
                    videoTrackState={callItem.videoTrackState}
                    audioTrackState={callItem.audioTrackState}
                    isLocal={isLocal(id)}
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
