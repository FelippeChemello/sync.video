import { AuthProvider } from '../hooks/Auth';
import { ToastProvider } from '../hooks/Toast';

export default function AppProvider({ children }) {
    return (
        <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
    );
}
