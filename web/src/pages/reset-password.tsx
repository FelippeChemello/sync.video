import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';
import Router, { useRouter } from 'next/router';

import api from '../services/api';
import { useToast } from '../hooks/Toast';

import { Container, Content } from '../styles/reset-password';

interface FormInputs {
    name: string;
    email: string;
    password: string;
}

const ResetPassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();
    const { addToast } = useToast();
    const {
        query: { token },
    } = useRouter();

    const formSubmit = handleSubmit(async ({ password }) => {
        try {
            await api.post('sessions/reset-password', { token, password });
            addToast({
                title: 'Senha alterada com sucesso',
                description: 'Efetuando login',
                type: 'success',
            });
            Router.push('/signin');
        } catch (err) {
            addToast({
                title: 'Erro ao recuperar senha',
                description: 'Verifique os dados digitados',
                type: 'error',
            });
        }
    });

    return (
        <Container>
            <Content>
                <img src="/assets/logo.png" alt="GoBarber" />

                <form onSubmit={formSubmit}>
                    <h1>Recuperação de senha</h1>

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
                            {errors.password && 'Senha não possui 8 caracteres'}
                        </span>
                    }

                    <button type="submit">
                        <FiLogIn />
                        Alterar senha
                    </button>
                </form>
            </Content>
        </Container>
    );
};

export default ResetPassword;
