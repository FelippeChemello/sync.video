import { createContext, useState, useEffect, useContext, useRef } from 'react';
import Router from 'next/router';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '../Auth';
import { useToast } from '../Toast';
import { useConfig } from './Config';

type InterfaceSocketIoContext = {
    socket: Socket;
    socketConnected: boolean;
    socketMode: 'active' | 'passive';
    setSocketMode: (mode: 'active' | 'passive') => void;
    socketAddListener: (
        event: string,
        callback: (data: unknown) => void,
    ) => void;
    socketEmit: (event: string, data: unknown) => void;
};

const SocketIoContext = createContext<InterfaceSocketIoContext>(
    {} as InterfaceSocketIoContext,
);

export function useSocketIo(): InterfaceSocketIoContext {
    const context = useContext(SocketIoContext);

    if (!context) {
        throw new Error('useConfig must be used within a SocketIoProvider');
    }

    return context;
}

export function SocketIoProvider({ children }) {
    const socket = useRef<Socket>();
    const [connected, setConnected] = useState(false);
    const [socketMode, setSocketMode] = useState<'active' | 'passive'>(
        'passive',
    );

    const { token } = useAuth();
    const { environmentVariables } = useConfig();
    const { addToast } = useToast();

    useEffect(() => {
        if (socket.current instanceof Socket || !token) return;

        const socketIo = io(environmentVariables.wsUrl, {
            auth: { token: `Bearer ${token}` },
        });

        socket.current = socketIo;

        connect();
    }, [token]);

    const socketAddListener = (
        event: string,
        callback: (data: unknown) => void,
    ) => {
        if (socket.current.hasListeners(event)) socket.current.off(event);

        socket.current.on(event, callback);
    };

    const socketEmit = (event: string, data: unknown) => {
        socket.current.emit(event, data);
    };

    const connect = () => {
        socket.current.connect();

        socketAddListener('connect_success', () => {
            setConnected(true);

            window.onunload = () => {
                socket.current.disconnect();
            };
        });

        socketAddListener('connect_error', error => {
            console.error('Falhou', error);

            setConnected(false);

            socket.current.disconnect();

            addToast({
                type: 'error',
                title: 'Error',
                description: 'Connection error',
            }); //TODO: i18n

            // setTimeout(() => {
            // Router.push('/');
            // }, 1500);
        });
    };

    return (
        <SocketIoContext.Provider
            value={{
                socket: socket.current,
                socketAddListener,
                socketEmit,
                socketConnected: connected,
                setSocketMode,
                socketMode,
            }}
        >
            {children}
        </SocketIoContext.Provider>
    );
}
