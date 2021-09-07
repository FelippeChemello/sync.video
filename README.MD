# ANOTAÇÔES

# Ideias

-   Sincroniza com websocket
-   Opção de sincronizar por play/pause ou playback speed
-   Investigar uso GRPC
-   MySQL -> Usuários | Autentiação | Free e Premium
-   MongoDB -> Sala (Usuários [owner e guest] | Videos | Chat)
-   VideoConferência (peerJs) - https://dev.to/codesphere/building-a-video-chat-app-with-socket-io-peerjs-codesphere-5a63
-   Remover fundo da camera (https://blog.tensorflow.org/2019/11/updated-bodypix-2.html)
-   Chat
-   Clientes: Site e Extensão Chrome
-   Easter egg: Tetris multiplayer (https://www.youtube.com/watch?v=RoRlXxeozbQ)

```js
    import { useState } from 'react';
    import { io, Socket } from 'socket.io-client';
    import { useEffect } from 'react';

    const [wsClient, setWsClient] = useState<Socket>();

    useEffect(() => {
        const socketIo = io('ws://localhost:3001');

        console.log(socketIo);

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
```
