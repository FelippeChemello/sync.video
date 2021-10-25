import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';

import api from '../services/api';
import { useAuth } from '../hooks/Auth';
import { useToast } from '../hooks/Toast';

import Blob from '../components/blob';
import I18Button from '../components/i18button';
import Separator from '../components/separator';

import {
    Container,
    Content,
    Background,
    AnimationContainer,
} from '../styles/signin';

interface FormInputs {
    email: string;
    password: string;
}

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { t } = useTranslation('common');
    const { register, handleSubmit } = useForm<FormInputs>();
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const formSubmit = handleSubmit(
        async ({ email, password }: SignInFormData) => {
            try {
                await signIn({ email, password });
                addToast({ title: t('signin-success'), type: 'success' });
            } catch (err) {
                addToast({ title: t('signin-error'), type: 'error' });
            }
        },
    );

    return (
        <Container>
            <I18Button />
            <Content>
                <Blob left={-50} top={100} />
                <Blob right={50} top={300} width={200} height={250} />
                <Blob left={150} bottom={50} />
                <AnimationContainer>
                    <img src="/assets/logo.png" alt="sync.video" />

                    <form onSubmit={formSubmit}>
                        <h1>{t('login-title')}</h1>

                        <input
                            placeholder="E-mail"
                            name="email"
                            {...register('email', { required: true })}
                        />

                        <input
                            type="password"
                            placeholder={t('password')}
                            name="password"
                            {...register('password', { required: true })}
                        />

                        <button type="submit">
                            <FiLogIn />
                            {t('login-title')}
                        </button>

                        <Link href="/forgot-password">
                            {/* TODO: create forgot-password page */}
                            {t('forgot-password')}
                        </Link>
                    </form>

                    <Separator text={t('or')} color="#a1b2cd" distance={32} />

                    <Link href="/signup">{t('create-account')}</Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const { ['sync.video-token']: token } = parseCookies(ctx);

        if (!token) {
            throw new Error('Token not found');
        }

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        await api.get('users');

        return { redirect: { destination: '/dashboard', permanent: false } };
    } catch (err) {
        return {
            props: {
                ...(await serverSideTranslations(ctx.locale, ['common'])),
            },
        };
    }
};

export default SignIn;
