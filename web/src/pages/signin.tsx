import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
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

interface FormInputs {
    email: string;
    password: string;
}

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { register, handleSubmit } = useForm<FormInputs>();
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const formSubmit = handleSubmit(
        async ({ email, password }: SignInFormData) => {
            try {
                await signIn({ email, password });
                addToast({ title: 'Login efetuado', description: 'Redirecionando para página inicial', type: 'success' });
            } catch (err) {
                addToast({ title: 'Erro ao efetuar login', description: 'Verifique os dados digitados', type: 'error' });
            }
        },
    );

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

                        <button type="submit">
                            <FiLogIn />
                            Entrar
                        </button>

                        <Link href="/forgot-password">
                            {/* TODO: create forgot-password page */}
                            Esqueci minha senha
                        </Link>
                    </form>

                    <Separator text="ou" color="#a1b2cd" distance={32} />

                    <Link href="/signup">Criar conta</Link>
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
            props: {},
        };
    }
};

export default SignIn;
