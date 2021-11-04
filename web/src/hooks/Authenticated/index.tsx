import { ConfigProvider } from './Config';
import { PeerJsProvider } from './PeerJs';
import { SocketIoProvider } from './SocketIo';

export default function AuthenticatedAppProvider({ children }) {
    return (
        <ConfigProvider>
            <SocketIoProvider>
                <PeerJsProvider>{children}</PeerJsProvider>
            </SocketIoProvider>
        </ConfigProvider>
    );
}
