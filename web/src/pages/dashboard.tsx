import { useCallback, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { parseCookies } from 'nookies';

import api from '../services/api';
import {useToast} from '../hooks/Toast'

import { Main, Container } from '../styles/dashboard';

import TopBar from '../components/loggedTopBar';

export default function Dashboard() {
    const [partyCode, setPartyCode] = useState('');
    
    const {addToast} = useToast()

    const createParty = useCallback(async () => {
        try {
            const {
                data: { party: partyId },
            } = await api.post('/party');

            Router.push(`/party/${partyId}`);
        } catch (err) {
            addToast({ title: 'Falha ao criar reunião', type: 'error' })
        }
    }, []);

    const accessParty = event => {
        Router.push(`/party/${partyCode}`);
    }   

    return (
        <Container>
            <TopBar />
            <Main>
                <main>
                    <div>
                        <h1>Sincronize áudio e video com seus amigos automaticamente.</h1>
                        <h2>
                            Fornecemos uma <strong>sincronia perfeita </strong> entre todos os participantes conectados, além de <strong>video-chamada simultânea</strong>. Desfrute da <strong>melhor qualidade</strong> em seus videos, filmes e séries.
                        </h2>
                    </div>
                    <div>
                        <button onClick={createParty}>Criar reunião</button>
                        <input
                            placeholder="Digite o código da reunião"
                            onChange={event => setPartyCode(event.target.value)}
                        ></input>
                        <button onClick={accessParty}>
                            Participar
                        </button>
                    </div>
                </main>
                <aside>
                    TODO
                </aside>
            </Main>
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
            props: {},
        };
    } catch (err) {
        return { redirect: { destination: '/', permanent: false } };
    }
};
