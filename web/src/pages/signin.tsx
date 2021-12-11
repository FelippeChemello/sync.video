import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';

import api from '../services/api';
import { useAuth } from '../hooks/Auth';
import { useToast } from '../hooks/Toast';

import Blob from '../components/blob';
import Separator from '../components/separator';

import {
    Container,
    Content,
    Background,
    AnimationContainer,
} from '../styles/signin';
import { Description } from '@headlessui/react/dist/components/description/description';

interface FormInputs {
    email: string;
    password: string;
}

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { register, handleSubmit, getValues } = useForm<FormInputs>();
    const { signIn } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const formSubmit = handleSubmit(
        async ({ email, password }: SignInFormData) => {
            setLoading(true);

            try {
                await signIn({ email, password });
                addToast({
                    title: 'Login efetuado',
                    description: 'Redirecionando para página inicial',
                    type: 'success',
                });
            } catch (err) {
                addToast({
                    title: 'Erro ao efetuar login',
                    description: 'Verifique os dados digitados',
                    type: 'error',
                });
            } finally {
                setLoading(false);
            }
        },
    );

    const forgotPassword = async () => {
        setLoading(true);
        const email = getValues().email;

        if (!email) {
            addToast({
                title: 'Email não informado',
                description: 'Por favor, informe o email ' + email,
                type: 'error',
            });
            return;
        }

        try {
            addToast({
                title: 'Recuperação de senha',
                description: `Recuperando senha, aguarde...`,
                type: 'info',
            });

            await api.post('/sessions/forgot-password', { email });

            addToast({
                title: 'Recuperação de senha',
                description: `E-mail enviado com sucesso para ${email}`,
                type: 'success',
            });
        } catch (err) {
            addToast({
                title: 'Erro ao recuperar senha',
                description: 'Verifique os dados digitados',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Content>
                <Blob left={-50} top={100} />
                <Blob right={50} top={300} width={200} height={250} />
                <Blob left={150} bottom={50} />
                <AnimationContainer>
                    <img src="/assets/logo.png" alt="sync.video" />

                    <form onSubmit={formSubmit}>
                        <h1>Login</h1>

                        <input
                            placeholder="E-mail"
                            name="email"
                            {...register('email', { required: true })}
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            name="password"
                            {...register('password', { required: true })}
                        />

                        <button type="submit" disabled={loading}>
                            <FiLogIn />
                            Entrar
                        </button>
                    </form>

                    <button onClick={forgotPassword} disabled={loading}>
                        Esqueci minha senha
                    </button>

                    <Separator text="ou" color="#a1b2cd" distance={32} />

                    <Link href="/signup">Criar conta</Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default SignIn;
