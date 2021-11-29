interface InterfaceParticipant {
    avatar: string;
    name: string;
    id: number;
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

interface Video {
    id: number;
    partyId: string;
    url: string;
    second: number;
    type: 'url' | 'magnet';
    isActive: boolean;
    isPlaying: boolean;
    playbackRate: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    uploadedAt: string;
    thumbnail: string;
}
