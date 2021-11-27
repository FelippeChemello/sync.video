interface InterfaceParticipant {
    avatar: string;
    name: string;
    id: number
}

interface SocketData {
    socketId: string;
    peerId: string;
    user: InterfaceParticipant;
}

interface InterfaceVideo {
    id: number;
    url: string;
    second: number;
    type: 'url' | 'magnet';
    isActive: boolean;
    isPlaying: boolean;
    playbackRate: number;
}

interface InterfaceParty {
    id: string;
    ownerId: number;
    partiesUsersRelationship: SocketData[];
    videos: InterfaceVideo[];
    roomUrl: string;
}

interface InterfaceProgress {
    playedSeconds: number;
    played: number;
    loadedSeconds: number;
    loaded: number;
}
