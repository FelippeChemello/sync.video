import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { shade } from 'polished';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiLogOut } from 'react-icons/fi';

import { useAuth } from '../hooks/Auth';

const Container = styled.div`
    height: 5rem;
    padding: 1rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > img {
        height: 3rem;
    }

    > section {
        display: flex;
        align-items: center;

        span {
            margin-right: 1rem;
        }

        a {
            border: 1px solid #5f6368;
            padding: 0.5rem;
            border-radius: 3rem;
        }
    }

    > div {
        position: relative;
        width: 150px;
        user-select: none;

        button {
            margin-left: auto;
            font-size: 1rem;
            display: flex;
            align-items: center;
            position: relative;
            border: none;
            background-color: transparent;
            line-height: 38px;
            cursor: pointer;
            padding: 1px 0.7rem;
            border-radius: 5rem;

            &:hover {
                background-color: ${shade(0.05, '#fff')};
            }

            img {
                height: 2rem;
                border-radius: 50%;
                margin-right: 0.5rem;
            }
        }

        > div {
            position: absolute;
            z-index: 10;
            width: 100%;
            border: 1px solid rgb(223, 223, 223);
            border-radius: 0.5rem;
            box-shadow: 0 2px 5px -1px rgb(232, 232, 232);
            background-color: white;
            padding: 15px 0;

            > div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 8px 10px;
                font-size: 0.9rem;
                line-height: 1.6rem;
                cursor: pointer;
                border-radius: 0;
                min-width: 0;

                span {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                &:hover {
                    background-color: ${shade(0.05, '#fff')};
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        > section {
            display: none;
        }
    }
`;

const Grow = styled.div`
    flex-grow: 1;
`;

export default function LoggedTopBar() {
    const { user, logOut } = useAuth();

    const [dateTime, setDateTime] = useState(() => {
        const date = new Date();

        return format(date, 'HH:mm • dd/MM');
    });

    const name = useMemo(() => {
        return user?.name?.split(' ')[0] || '';
    }, [user]);

    const avatar = useMemo(() => {
        return user?.avatar || '';
    }, [user]);

    setInterval(() => {
        const date = new Date();

        setDateTime(format(date, 'HH:mm • dd/MM'));
    }, 30000);

    return (
        <Container>
            <img src="/assets/logo.png" alt="sync.video" />
            <Grow />
            <section>
                <span>{dateTime}</span>
            </section>
            <Menu as="div">
                <Menu.Button>
                    <img src={`data:image/png;base64,${avatar}`} alt={name} />
                    {name}
                </Menu.Button>
                <Menu.Items>
                    <Menu.Item as="div" onClick={() => logOut()}>
                        <span>Sair</span>
                        <FiLogOut />
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </Container>
    );
}
