import { createContext, useState, useEffect, useContext } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

import api from '../services/api';

interface InterfaceAuthContext {
    isAuthenticated: boolean;
    user: User;
    signIn: (data: SignInFormData) => Promise<void>;
    logOut: () => void;
}

interface SignInFormData {
    email: string;
    password: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

const AuthContext = createContext({} as InterfaceAuthContext);

export function useAuth(): InterfaceAuthContext {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);
    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'sync.video-token': token } = parseCookies();

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        if (token) {
            api.get('users')
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    destroyCookie(undefined, 'sync.video-token');
                });
        }
    }, []);

    async function signIn({ email, password }: SignInFormData) {
        const {
            data: { token, user },
        } = await api.post('sessions', { email, password });

        setCookie(undefined, 'sync.video-token', token, {
            maxAge: 60 * 60 * 24, // 1 day,
        });

        setUser(user);

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        Router.push('/dashboard');
    }

    async function logOut() {
        destroyCookie(undefined, 'sync.video-token');

        setUser({} as User);

        api.defaults.headers['Authorization'] = '';

        Router.push('/');
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}
