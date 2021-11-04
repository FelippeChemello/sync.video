import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { InterfacePeerJs } from '../../types/peer';

type InterfacePeerJsContext = {
    peer: InterfacePeerJs;
    peerReady: boolean;
    peerConnect: (id: string) => void;
};

const PeerJsContext = createContext<InterfacePeerJsContext>(
    {} as InterfacePeerJsContext,
);

export function usePeerJs(): InterfacePeerJsContext {
    const context = useContext(PeerJsContext);

    if (!context) {
        throw new Error('useConfig must be used within a PeerJsProvider');
    }

    return context;
}

export function PeerJsProvider({ children }) {
    const peer = useRef<InterfacePeerJs>();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        import('peerjs').then(({ default: Peer }) => {
            peer.current = new Peer(uuid(), {
                // TODO: change server
                // host: process.env.NEXT_PUBLIC_PEER_URL,
                // port: Number(process.env.NEXT_PUBLIC_PEER_PORT),
                // path: '/peer',
                debug: 2,
            });

            setReady(true);
        });
    }, []);

    const connect = (id: string) => {
        return peer.current.connect(id);
    };

    return (
        <PeerJsContext.Provider
            value={{
                peer: peer.current,
                peerReady: ready,
                peerConnect: connect,
            }}
        >
            {children}
        </PeerJsContext.Provider>
    );
}
