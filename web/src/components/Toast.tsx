import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { animated } from 'react-spring';
import { useTransition } from 'react-spring';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiInfo,
    FiXCircle,
} from 'react-icons/fi';

import { useToast, ToastMessage } from '../hooks/Toast';

interface ToastNotificationProps {
    messages: ToastMessage[];
}

interface ToastProps {
    message: ToastMessage;
    style: object;
}

const icons = {
    info: <FiInfo size={24} />,
    error: <FiAlertCircle size={24} />,
    success: <FiCheckCircle size={24} />,
};

export const Notifications = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    padding: 30px;
    overflow: hidden;
`;

interface NotificationProps {
    type?: 'success' | 'error' | 'info';
    hasDescription: boolean;
}

const toastTypeVariations = {
    info: css`
        background: #ebf8ff;
        color: #3172b7;
    `,
    success: css`
        background: #e6fffa;
        color: #2e656a;
    `,
    error: css`
        background: #fddede;
        color: #c53030;
    `,
};

//TODO: toast is being showed below the video on party page
const Notification = styled(animated.div)<NotificationProps>`
    width: 360px;
    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius: 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;

    ${props => toastTypeVariations[props.type || 'info']}

    & + div {
        margin-top: 8px;
    }

    > svg {
        margin: 4px 12px 0 0;
    }

    div {
        flex: 1;

        p {
            margin-top: 4px;
            font-size: 14px;
            opacity: 0.8;
            line-height: 20px;
        }
    }

    button {
        position: absolute;
        right: 16px;
        top: 19px;
        opacity: 0.6;
        border: 0;
        background: transparent;
        color: inherit;
    }

    ${props =>
        !props.hasDescription &&
        css`
            align-items: center;
            svg {
                margin-top: 0;
            }
        `}
`;

const Toast = ({ message, style }: ToastProps) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [message.id, removeToast]);

    return (
        <Notification
            type={message.type}
            style={style}
            hasDescription={!!message.description}
        >
            {icons[message.type || 'info']}

            <div>
                <strong>{message.title}</strong>
                {message.description && <p>{message.description}</p>}
            </div>

            <button type="button" onClick={() => removeToast(message.id)}>
                <FiXCircle size={18} />
            </button>
        </Notification>
    );
};

const ToastNotification = ({ messages }: ToastNotificationProps) => {
    const messagesWithTransitions = useTransition(messages, {
        from: { right: '-120%', opacity: 0 },
        enter: { right: '0%', opacity: 1 },
        leave: { right: '-120%', opacity: 0 },
    });

    return (
        <Notifications>
            {messagesWithTransitions(({ right, opacity }, item) => (
                <Toast
                    key={item.id}
                    message={item}
                    style={{ right, opacity }}
                />
            ))}
        </Notifications>
    );
};

export default ToastNotification;
