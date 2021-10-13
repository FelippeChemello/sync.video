# ANOTAÇÔES

# Ideias

-   No dashboardk
    -   Trocar aside carousel por lista de ultimas reuniões
        -   Retenção de reunião mensagens e possibilidade de acessar novamente (Free => 72h | Premium => 30 dias)
        -   Exportar mensagens (Apenas premium => Txt ou e-mail)
    -   Premium agendar reunião e convite por e-mail (com link para marcar no calendário)

-   Criar template de e-mail para convite de reunião e backup de mensagens

-   Sincroniza com websocket
-   Opção de sincronizar por play/pause ou playback speed
-   Investigar uso GRPC
-   MySQL -> Usuários | Autentiação | Free e Premium | Sala | Chat | Histórico de videos
-   VideoConferência (peerJs) - https://dev.to/codesphere/building-a-video-chat-app-with-socket-io-peerjs-codesphere-5a63
-   Remover fundo da camera (https://blog.tensorflow.org/2019/11/updated-bodypix-2.html)
-   Chat
-   Clientes: Site e Extensão Chrome (https://medium.com/reactbrasil/como-criar-uma-extens%C3%A3o-para-o-chrome-utilizando-react-60282e534009)
-   Easter egg: Tetris multiplayer (https://www.youtube.com/watch?v=RoRlXxeozbQ) - Icone <MdVideogameAsset />

-   Termos de serviço
-   Segurança

-   Procedimentos Metodologicos: História, experiencia que queria, benchmark, estudo de infra (de como fazer)

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
- Fonte Noto Sans Foi editada através do https://www.glyphrstudio.com/online/ para remover a barra do centro do 0
- Devemos remover o listener do socket para atualiza-lo, caso não remova, quando o componente for recarregado irá adicionar mais um listener para o mesmo evento gerando um loop (https://stackoverflow.com/a/32266619)