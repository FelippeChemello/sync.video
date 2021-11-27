import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';

import api from '../../services/api';

import AuthenticatedAppProvider from '../../hooks/Authenticated';

import Party from '../../components/party';
import { useRouter } from 'next/router';

export default function PartyProvider() {
    const {
        query: { id: partyId },
    } = useRouter();

    return (
        <AuthenticatedAppProvider>
            <Party partyId={partyId as string} />
        </AuthenticatedAppProvider>
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
            props: {}
        };
    } catch (err) {
        return { redirect: { destination: '/', permanent: false } };
    }
};
