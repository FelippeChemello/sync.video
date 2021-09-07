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
            <Main style={{ backgroundColor: 'blue' }}>
                <h1>
                    Watching videos with friends <span>made easy</span>
                </h1>
                <h2>
                    Don't worry anymore with syncing manually your videos.
                    <br />
                    Nevermore you would say '1, 2, 3 play'.
                </h2>

                <div>
                    <button className="login">
                        <Link href="signup">Sign up</Link>
                    </button>
                    <button>
                        <Link href="signin">Sign in</Link>
                    </button>
                </div>

                <img src="assets/home.svg" />
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
