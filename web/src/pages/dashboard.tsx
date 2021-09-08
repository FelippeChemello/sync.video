import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseCookies } from 'nookies';

import Link from 'next/link';

import { Main, Container } from '../styles/dashboard';

import TopBar from '../components/loggedTopBar';
import api from '../services/api';

export default function Dashboard() {
    return (
        <Container>
            <TopBar />
            <Main>
                <main>
                    <div>
                        <h1>
                            Sincronize áudio e video com seus amigos
                            automaticamente.
                        </h1>
                        <h2>
                            Fornecemos uma <strong>sincronia perfeita </strong>
                            entre todos os participantes conectados, além
                            de&nbsp;
                            <strong>videochamada simultanea</strong>. Desfrute
                            da&nbsp;<strong>melhor qualidade</strong> possível
                            em seus videos, filmes e séries.
                        </h2>
                    </div>
                </main>
                <aside>
                    <img
                        src="/assets/full-quality.svg"
                        alt="Full quality audio and video"
                    />
                    <img
                        style={{ display: 'none' }}
                        src="/assets/every-device.svg"
                        alt="Watch in every device"
                    />
                    <img
                        style={{ display: 'none' }}
                        src="/assets/video-conf.svg"
                        alt="Video conference integrated"
                    />
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
            props: {
                ...(await serverSideTranslations(ctx.locale, ['common'])),
            },
        };
    } catch (err) {
        return { redirect: { destination: '/', permanent: false } };
    }
};
