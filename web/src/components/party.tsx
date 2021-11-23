import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import { useAuth } from '../hooks/Auth';
import { useToast } from '../hooks/Toast';
import { useSocketIo } from '../hooks/Authenticated/SocketIo';

import Loading from './loading';
import Player from './player/player';
import VideoConference from './VideoConference/VideoConference';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #22272e;
    display: flex;

    main {
        flex: 1;
    }

    aside {
        max-width: 20vw;
        min-width: 300px;
        height: 100vh;
        background-color: #2d333b;
    }
`;

type Props = {
    partyId: string;
};

export default function Party({ partyId }: Props) {
    const [party, setParty] = useState<InterfaceParty>();

    const { socketAddListener, socketEmit, socketConnected, setSocketMode } =
        useSocketIo();
    const { addToast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!socketConnected) return;

        socketEmit('party:join', { partyId });

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
    }, [socketConnected, partyId, addToast]);

    useEffect(() => {
        if (!party) return;

        if (party.ownerId === user.id) {
            setSocketMode('active');
        } else {
            setSocketMode('passive');
        }
    }, [party]);

    if (!party) return <Loading />; // TODO: Add socket and peer ready check

    console.log('render');

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
                <VideoConference partyId={party.id} roomUrl={party.roomUrl} />
            </aside>
        </Container>
    );
}
