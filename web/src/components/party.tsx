import { useCallback, useEffect, useState, useMemo } from 'react';
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

    @media (max-width: 1024px) {
        flex-direction: column;

        main {
            width: 100vw;
            height: 100vw;
            max-height: 50vh;
            flex: initial;
        }

        aside {
            flex: 1;
            min-height: 50vh;
            width: 100vw;
            min-width: 100vw;
            max-width: 100vw;
        }
    }
`;

type Props = {
    partyId: string;
};

export default function Party({ partyId }: Props) {
    const [party, setParty] = useState<InterfaceParty>();
    const [ownerId, setOwnerId] = useState<number>();

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
                title: 'Erro',
                description: error,
            });

            setTimeout(() => {
                Router.push('/dashboard');
            }, 1500);
        });

        socketAddListener('party:joined', (party: InterfaceParty) => {
            setParty(party);
        });

        socketAddListener('party:updated', (party: InterfaceParty) => {
            setParty(party);
        });
    }, [socketConnected, partyId, addToast]);

    useEffect(() => {
        console.log(party);

        if (!party) return;

        const { ownerId } = party;

        setOwnerId(ownerId);

        if (ownerId === user.id) {
            setSocketMode('active');
        } else {
            setSocketMode('passive');
        }
    }, [party]);

    if (!party) return <Loading />;

    return (
        <Container>
            <main>
                <Player
                    partyId={party.id}
                    url={
                        party.videos?.filter(video => video.isActive)[0]?.url ||
                        ''
                    }
                    currentTime={
                        party.videos?.filter(video => video.isActive)[0]
                            ?.second || 0
                    }
                />
            </main>
            <aside>
                <VideoConference
                    partyId={party.id}
                    roomUrl={party.roomUrl}
                    ownerId={ownerId}
                />
            </aside>
        </Container>
    );
}
