# ANOTAÇÔES

# Ideias

-   No dashboardk

    -   Trocar aside carousel por lista de ultimas reuniões
        -   Retenção de reunião mensagens e possibilidade de acessar novamente (Free => 72h | Premium => 30 dias)
        -   Exportar mensagens (Apenas premium => Txt ou e-mail)
    -   Premium agendar reunião e convite por e-mail (com link para marcar no calendário)

-   Criar template de e-mail para convite de reunião e backup de mensagens

-   Opção de sincronizar por play/pause ou playback speed
-   Criar planos Free e Premium
-   Clientes: Site e Extensão Chrome (https://medium.com/reactbrasil/como-criar-uma-extens%C3%A3o-para-o-chrome-utilizando-react-60282e534009)
-   Criar 404
-   Easter egg: Tetris multiplayer (https://www.youtube.com/watch?v=RoRlXxeozbQ) - Icone <MdVideogameAsset />
-   Resize aside and video width on party -> https://stackoverflow.com/questions/26233180/resize-a-div-on-border-drag-and-drop-without-adding-extra-markup

-   Termos de serviço
-   Segurança

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

Anotações:

-   Criar cron para remover arquivos de videos antigos
-   Criar forgot password
-   Desabilitar botão de login e cadastro quando clicar
-   Corrigir sync pausando
-   Servidor crash quando desconecta inesperadamente um usuário

TODO in future: 
- Add playbackrate option to player
- Add another types of sync (via playback rate and calculating latency, then disregard it [EXPERIMENTAL])