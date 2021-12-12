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
        name: string;
        userId: number;
    };
};

export const initialCallItems = {
    local: {
        videoTrackState: null,
        audioTrackState: null,
        isOwner: false,
        name: null,
        userId: null,
    },
};

export function getCallItems(
    participants: DailyParticipantsObject,
    ownerId: number,
): CallState {
    let callItems = { ...initialCallItems };

    Object.entries(participants).forEach(([participantId, participant]) => {
        const userId = Number(participant.user_name.split(' - ')[1].trim());

        callItems[participantId] = {
            name: participant.user_name.split(' - ')[0].trim(),
            userId,
            videoTrackState: participant.tracks.video,
            audioTrackState: participant.tracks.audio,
            isOwner: userId === ownerId,
            ownerId,
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
