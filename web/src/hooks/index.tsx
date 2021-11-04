import { AuthProvider } from './Auth';
import { ToastProvider } from './Toast';

export default function AppProvider({ children }) {
    return (
        <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
    );
}
