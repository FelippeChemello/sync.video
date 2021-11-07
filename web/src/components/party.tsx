import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import { useAuth } from '../hooks/Auth';
import { useToast } from '../hooks/Toast';
import { useConfig } from '../hooks/Authenticated/Config';
import { useSocketIo } from '../hooks/Authenticated/SocketIo';
import { usePeerJs } from '../hooks/Authenticated/PeerJs';

import Loading from './loading';
import Player from './player/player';
import VideoConference from './videoconference';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #22272e;
    display: flex;

    main {
        flex: 1;
    }

    aside {
        width: 20vw;
        height: 100vh;
        background-color: #2d333b;
    }
`;

type Props = {
    partyId: string;
};

export default function Party({ partyId }: Props) {
    const [party, setParty] = useState<InterfaceParty>();

    const { isWebcamStreamAvailable } = useConfig();
    const { socketAddListener, socketEmit, socketConnected, setSocketMode } =
        useSocketIo();
    const { peer, peerReady } = usePeerJs();
    const { addToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!socketConnected || !peerReady) return;

        socketEmit('party:join', { partyId, peerId: peer.id });

        socketAddListener('party:error', (error: string) => {
            addToast({
                type: 'error',
                title: 'Error while getting party info',
                description: error,
            }); // TODO: i18n

            setTimeout(() => {
                Router.push('/dashboard');
            }, 1500);
        });

        socketAddListener('party:joined', (party: InterfaceParty) => {
            setParty(party);
        });
    }, [socketConnected, peerReady]);

    useEffect(() => {
        if (!party) return;

        if (party.ownerId === user.id) {
            setSocketMode('active');
        } else {
            setSocketMode('passive');
        }
    }, [party]);

    if (!party) return <Loading />; // TODO: Add socket and peer ready check

    return (
        <Container>
            <main>
                <Player
                    partyId={party.id}
                    url={
                        party.videos.filter(video => video.isActive)[0]?.url ||
                        ''
                    }
                    currentTime={
                        party.videos.filter(video => video.isActive)[0]
                            ?.second || 0
                    }
                />
            </main>
            <aside>
                {isWebcamStreamAvailable && (
                    <VideoConference partyId={party.id} />
                )}
            </aside>
        </Container>
    );
}
