import { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

import ToastNotification from '../components/Toast';

interface ToastContextInterface {
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

export interface ToastMessage {
    id: string;
    type?: 'success' | 'error' | 'info';
    title: string;
    description?: string;
}

const ToastContext = createContext<ToastContextInterface>(
    {} as ToastContextInterface,
);

const ToastProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(
        ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
            const id = uuid();

            const toast = {
                id,
                type,
                title,
                description,
            };

            setMessages(oldMessages => [...oldMessages, toast]); // Um setter de estado passa por parametro o estado anterior, ou seja, com isso conseguimos pegar os dados anteriormente setados e adicionar o novo valor
        },
        [],
    );

    const removeToast = useCallback((id: string) => {
        setMessages(currentMessages =>
            currentMessages.filter(message => message.id !== id),
        );
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}

            <ToastNotification messages={messages} />
        </ToastContext.Provider>
    );
};

function useToast(): ToastContextInterface {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

export { ToastProvider, useToast };
