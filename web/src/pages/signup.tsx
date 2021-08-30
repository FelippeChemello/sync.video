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
} from '../styles/signup';

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
            <Background />
            <Content>
                <Blob right={50} top={-50} />
                <Blob left={50} bottom={300} width={200} height={250} />
                <Blob right={-50} bottom={-50} />
                <AnimationContainer>
                    <img src="/assets/logo.png" alt="GoBarber" />

                    <form>
                        <h1>{t('signup-title')}</h1>

                        <input placeholder="E-mail" name="email" />

                        <input
                            type="password"
                            placeholder={t('password')}
                            name="password"
                        />

                        <button type="submit">
                            <FiLogIn />
                            {t('signup-title')}
                        </button>

                        <Link href="/forgot-password">
                            {t('forgot-password')}
                        </Link>
                    </form>

                    <Separator text={t('or')} color="#a1b2cd" distance={32} />

                    <Link href="/signin">{t('login-title')}</Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'footer'])),
    },
});

export default SignIn;
