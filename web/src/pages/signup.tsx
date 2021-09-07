import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
} from '../styles/signup';

interface FormInputs {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const { t } = useTranslation('common');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const formSubmit = handleSubmit(async ({ email, name, password }) => {
        try {
            await api.post('users', { email, name, password });
            addToast({
                title: t('signup-success'),
                description: t('signup-description-success'),
                type: 'success',
            });
            await signIn({ email, password });
        } catch (err) {
            addToast({
                title: t('signup-error'),
                type: 'error',
            });
        }
    });

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

                    <form onSubmit={formSubmit}>
                        <h1>{t('signup-title')}</h1>

                        <input
                            placeholder={t('name')}
                            name="name"
                            {...register('name', { required: true })}
                        />
                        {<span>&nbsp; {errors.name && t('name-invalid')}</span>}

                        <input
                            placeholder="E-mail"
                            name="email"
                            {...register('email', { required: true })}
                        />
                        {
                            <span>
                                &nbsp; {errors.email && t('email-invalid')}
                            </span>
                        }

                        <input
                            type="password"
                            placeholder={t('password')}
                            name="password"
                            {...register('password', {
                                required: true,
                                minLength: 8,
                            })}
                        />
                        {
                            <span>
                                &nbsp;
                                {errors.password && t('password-invalid')}
                            </span>
                        }

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

export default SignUp;
