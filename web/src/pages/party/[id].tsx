import { useCallback, useEffect, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { io, Socket } from 'socket.io-client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseCookies } from 'nookies';

import api from '../../services/api';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';

import Loading from '../../components/loading';
import Webcam from '../../components/webcam';
import Player from '../../components/player/player';
import { Container } from '../../styles/party';

export default function Party() {
    const { t } = useTranslation('common');
    const [party, setParty] = useState<InterfaceParty>();
    const [socketMode, setSocketMode] = useState<'passive' | 'active'>();
    const { addToast } = useToast();
    const { user } = useAuth();
    const { ['sync.video-token']: token } = parseCookies();

    const [wsClient, setWsClient] = useState<Socket>();
    const {
        query: { id: partyId },
    } = useRouter();

    useEffect(() => {
        connectSocket();
    }, []);

    useEffect(() => {
        handleSocketPartyEvents();
    }, [wsClient]);

    const connectSocket = useCallback(() => {
        const socketIo = io('ws://localhost:3001', {
            auth: { token: `Bearer ${token}` },
        }); // TODO: change to real server

        socketIo.on('connect_error', error => {
            socketIo.disconnect();

            addToast({
                title: 'Ocorreu um erro',
                description:
                    'Por favor, efetue novamente o login e tente novamente',
                type: 'error',
            });

            setTimeout(() => {
                Router.push('/');
            }, 1500);
        });

        setWsClient(socketIo);
    }, [token]);

    const handleSocketPartyEvents = useCallback(() => {
        if (!wsClient) return;

        wsClient.connect();

        wsClient.emit('party:join', { partyId });

        wsClient.on('party:error', () => {
            addToast({
                title: 'Erro ao entrar na reunião',
                description:
                    'Não encontramos uma reunião com o código solicitado. Por favor verifique o código digitado',
                type: 'error',
            });

            setTimeout(() => {
                Router.push('/dashboard');
            }, 1500);
        });

        wsClient.on('party:joined', (data: InterfaceParty) => {
            setParty(data);
            console.log(data);
        });

        wsClient.on('party:changeOwner', (data: InterfaceParty) => {
            setParty(data);
            console.log(data);
        });

        window.onunload = () => {
            wsClient.disconnect();
        };
    }, [wsClient]);

    useEffect(() => {
        if (!party || !user) return;

        if (party.ownerId === user.id) {
            setSocketMode('active');
        } else {
            setSocketMode('passive');
        }

        console.log('Mode: ', socketMode);
    }, [party, user]);

    if (!party || !socketMode) {
        return <Loading />;
    }

    return (
        <Container>
            <main>
                <Player
                    socket={wsClient}
                    partyMode={socketMode}
                    partyId={party.id}
                    url={party.videos.filter(video => video.isActive)[0].url}
                    currentTime={
                        party.videos.filter(video => video.isActive)[0].second
                    }
                />
            </main>
            <aside>
                <Webcam />
            </aside>
        </Container>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const { ['sync.video-token']: token } = parseCookies(ctx);

        if (!token) {
            throw new Error('Token not found');
        }

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        await api.get('users');

        return {
            props: {
                ...(await serverSideTranslations(ctx.locale, ['common'])),
            },
        };
    } catch (err) {
        return { redirect: { destination: '/', permanent: false } };
    }
};
