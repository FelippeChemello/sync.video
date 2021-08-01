import Head from 'next/head';
import { useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import Image from 'next/image';

import { Main } from '../styles/home';

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
            <Head>
                <link
                    rel="preload"
                    href="assets/Product Sans Regular.ttf"
                    as="font"
                    crossOrigin=""
                />
                <title>Sync video player with friends</title>
                <meta
                    name="description"
                    content="Sync video player with friends"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
                    <button className="login">Sign up</button>
                    <button>Sign in</button>
                </div>

                <img src="assets/home.svg" />
            </Main>
        </>
    );
}
