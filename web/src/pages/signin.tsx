import { useContext } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';

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
    const {addToast} = useToast();

    const formSubmit = handleSubmit(
        async ({ email, password }: SignInFormData) => {
            try {
                await signIn({ email, password });
                addToast({title: t('signin-success'), type: 'success'});
            } catch (err) {
                addToast({title: t('signin-error'), type: 'error'});
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

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'footer'])),
    },
});

export default SignIn;
