import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import Link from 'next/link';

import { Main } from '../styles/home';

import I18Button from '../components/i18button';

export default function Home() {
    const [wsClient, setWsClient] = useState<Socket>();

    useEffect(() => {
        const socketIo = io('ws://localhost:3001');

        setWsClient(socketIo);
    }, []);

    useEffect(() => {
        if (wsClient) {
            wsClient.connect();
            wsClient.on('status', msg => console.log(msg));

            window.onunload = () => {
                wsClient.disconnect();
            };
        }
    }, [wsClient]);

    return (
        <>
            <I18Button />
            <Main>
                <h1>
                    Watching videos with friends <span>made easy</span>
                </h1>
                <h2>
                    Don't worry anymore with syncing manually your videos.
                    <br />
                    Nevermore you would say '1, 2, 3 play'.
                </h2>

                <div>
                    <button className="login">
                        <Link href="signup">Sign up</Link>
                    </button>
                    <button>
                        <Link href="signup">Sign in</Link>
                    </button>
                </div>

                <img src="assets/home.svg" />
            </Main>
        </>
    );
}
