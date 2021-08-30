import { useCallback } from 'react';
import Link from 'next/link';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FiLogIn } from 'react-icons/fi';

import Blob from '../components/blob';
import I18Button from '../components/i18button';
import Separator from '../components/separator';

import {
    Container,
    Content,
    Background,
    AnimationContainer,
} from '../styles/signin';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { t } = useTranslation('common');

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <Container>
            <I18Button />
            <Content>
                <Blob left={-50} top={100} />
                <Blob right={50} top={300} width={200} height={250} />
                <Blob left={150} bottom={50} />
                <AnimationContainer>
                    <img src="/assets/logo.png" alt="GoBarber" />

                    <form>
                        <h1>{t('login-title')}</h1>

                        <input placeholder="E-mail" name="email" />

                        <input
                            type="password"
                            placeholder={t('password')}
                            name="password"
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
