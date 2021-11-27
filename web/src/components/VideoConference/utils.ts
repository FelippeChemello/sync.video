import {
    DailyTrackState,
    DailyParticipant,
    DailyCall,
    DailyParticipantsObject,
} from '@daily-co/daily-js';

export enum VideoConferenceState {
    IDLE,
    CREATING,
    JOINING,
    JOINED,
    LEAVING,
    ERROR,
}

export enum ActionType {
    CLICK_ALLOW_TIMEOUT,
    PARTICIPANTS_CHANGE,
    CAM_OR_MIC_ERROR,
    FATAL_ERROR,
}

export type CallState = {
    [participantId: string]: {
        videoTrackState: DailyTrackState;
        audioTrackState: DailyTrackState;
        isOwner: boolean;
        ownerPeerId: string;
    };
};

export const initialCallItems = {
    local: {
        videoTrackState: null,
        audioTrackState: null,
        isOwner: false,
        ownerPeerId: null,
    },
};

export function getCallItems(participants: DailyParticipantsObject, ownerPeerId: string): CallState {
    let callItems = { ...initialCallItems };

    Object.entries(participants).forEach(([participantId, participant]) => {
        callItems[participantId] = {
            videoTrackState: participant.tracks.video,
            audioTrackState: participant.tracks.audio,
            isOwner: participantId === ownerPeerId,
            ownerPeerId
        };
    });

    return callItems;
}

export function isLocal(id) {
    return id === 'local';
}

export function getStreamStates(callObject: DailyCall) {
    let isCameraClosed = false;
    let isMicMuted = false;

    if (
        callObject &&
        callObject.participants() &&
        callObject.participants().local
    ) {
        const localParticipant = callObject.participants().local;
        isCameraClosed = !localParticipant.video;
        isMicMuted = !localParticipant.audio;
    }

    return { isCameraClosed, isMicMuted };
}
