import { useCallback, useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { io, Socket } from 'socket.io-client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseCookies } from 'nookies';

import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import Loading from '../../components/loading';
import { Container } from '../../styles/party';

interface InterfaceParticipant {
    avatar: string;
    name: string;
}

interface SocketData {
    socketId: string;
    user: InterfaceParticipant;
}

interface InterfaceParty {
    id: string;
    ownerId: number;
    partiesUsersRelationship: SocketData[];
}

export default function Party() {
    const [party, setParty] = useState<InterfaceParty>();

    const { t } = useTranslation('common');
    const { addToast } = useToast();
    const { ['sync.video-token']: token } = parseCookies();

    const [wsClient, setWsClient] = useState<Socket>();
    const {
        query: { id: partyId },
    } = useRouter();

    useEffect(() => {
        const socketIo = io('ws://localhost:3001', {
            auth: { token: `Bearer ${token}` },
        });

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
    }, []);

    useEffect(() => {
        if (wsClient) {
            wsClient.connect();

            wsClient.emit('selectParty', { partyId });

            wsClient.on('partyError', error => {
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

            wsClient.on('joinedParty', data => setParty(data));

            window.onunload = () => {
                wsClient.disconnect();
            };
        }
    }, [wsClient]);

    useEffect(() => {
        console.log(party);
    }, [party]);

    if (!party) {
        return <Loading />;
    }

    return (
        <Container>
            <main>
                <h1>{party.id}</h1>
            </main>
            <div>oi</div>
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