import Link from 'next/link';
import { parseCookies } from 'nookies';
import { GetServerSidePropsContext } from 'next';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';

import api from '../services/api';
import getAvatar from '../services/avatar';
import { useAuth } from '../hooks/Auth';
import { useToast } from '../hooks/Toast';

import Blob from '../components/blob';
import Separator from '../components/separator';

import {
    Container,
    Content,
    Background,
    AnimationContainer,
} from '../styles/signup';
import convertFileToBase64 from '../utils/fileToBase64';

interface FormInputs {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const formSubmit = handleSubmit(async ({ email, name, password }) => {
        try {
            const avatar = await convertFileToBase64(await getAvatar(name));
            console.log(avatar);

            await api.post('users', { email, name, password, avatar });
            addToast({
                title: "Cadastro realizado com sucesso",
                description: "Efetuando login",
                type: 'success',
            });
            await signIn({ email, password });
        } catch (err) {
            addToast({
                title: "Erro ao criar conta",
                description: "Verifique os dados digitados",
                type: 'error',
            });
        }
    });

    return (
        <Container>
            <Background />
            <Content>
                <Blob right={50} top={-50} />
                <Blob left={50} bottom={300} width={200} height={250} />
                <Blob right={-50} bottom={-50} />
                <AnimationContainer>
                    <img src="/assets/logo.png" alt="GoBarber" />

                    <form onSubmit={formSubmit}>
                        <h1>Cadastre-se</h1>

                        <input
                            placeholder="Nome"
                            name="name"
                            {...register('name', { required: true })}
                        />
                        {<span>&nbsp; {errors.name && "Nome inválido"}</span>}

                        <input
                            placeholder="E-mail"
                            name="email"
                            {...register('email', { required: true })}
                        />
                        {
                            <span>
                                &nbsp; {errors.email && "Email inválido"}
                            </span>
                        }

                        <input
                            type="password"
                            placeholder="Senha"
                            name="password"
                            {...register('password', {
                                required: true,
                                minLength: 8,
                            })}
                        />
                        {
                            <span>
                                &nbsp;
                                {errors.password && "Senha não possui 8 caracteres"}
                            </span>
                        }

                        <button type="submit">
                            <FiLogIn />
                            Cadastrar
                        </button>
                    </form>

                    <Separator text="ou" color="#a1b2cd" distance={32} />

                    <Link href="/signin">Efetuar login</Link>
                </AnimationContainer>
            </Content>
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

export default SignUp;
