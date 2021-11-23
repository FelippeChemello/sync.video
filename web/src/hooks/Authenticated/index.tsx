import { SocketIoProvider } from './SocketIo';

export default function AuthenticatedAppProvider({ children }) {
    return <SocketIoProvider>{children}</SocketIoProvider>;
}
