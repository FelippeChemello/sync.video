import {
    createContext,
    useState,
    useEffect,
    useContext,
    useRef,
    MutableRefObject,
} from 'react';

import checkWasmSupport from '../../utils/checkWasmSupport';
import checkWebGlSupport from '../../utils/checkWebGLSupport';
import { webcamBackgrounds } from '../../utils/webcamBackgrounds';

import ConfigModal from '../../components/config';

type InterfaceConfigContext = {
    virtualBackgroundSupported: boolean;
    environmentVariables: { [key: string]: string };

    isConfigModalOpen: boolean;
    handleConfigModal: () => void;

    webcamStream: MutableRefObject<MediaStream>;
    isWebcamStreamAvailable: boolean;
    setIsWebcamStreamAvailable: (isWebcamStreamAvailable: boolean) => void;

    webcamBackground: WebcamBackgroundTypesDisplay;
    setWebcamBackground: (background: WebcamBackgroundTypesDisplay) => void;

    webcamDeviceId: string;
    setWebcamDeviceId: (deviceId: string) => void;

    microphoneDeviceId: string;
    setMicrophoneDeviceId: (deviceId: string) => void;

    isWebcamEnabled: boolean;
    toggleWebcam: () => void;

    isMicrophoneEnabled: boolean;
    toggleMicrophone: () => void;
};

const ConfigContext = createContext({} as InterfaceConfigContext);

export function useConfig(): InterfaceConfigContext {
    const context = useContext(ConfigContext);

    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }

    return context;
}

export function ConfigProvider({ children }) {
    const [virtualBackgroundSupported, setVirtualBackgroundSupported] =
        useState(false);
    const webcamStream = useRef<MediaStream>();
    const [isWebcamStreamAvailable, setIsWebcamStreamAvailable] =
        useState(false);
    const [webcamBackground, setWebcamBackground] =
        useState<WebcamBackgroundTypesDisplay>(webcamBackgrounds.camera[0]);
    const [webcamDeviceId, setWebcamDeviceId] = useState<string>();
    const [microphoneDeviceId, setMicrophoneDeviceId] = useState<string>();
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(true);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
    const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
    const [environmentVariables, setEnvironmentVariables] = useState<{
        [key: string]: string;
    }>(() => {
        return {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            avatarProviderApiUrl:
                process.env.NEXT_PUBLIC_AVATAR_PROVIDER_API_URL,
            wsUrl: process.env.NEXT_PUBLIC_WS_URL,
            peerUrl: process.env.NEXT_PUBLIC_PEER_URL,
            peerPort: process.env.NEXT_PUBLIC_PEER_PORT,
        }; //TODO: import from .env
    });

    useEffect(() => {
        setVirtualBackgroundSupported(
            checkWasmSupport() && checkWebGlSupport(),
        );
    }, []);

    const handleConfigModal = () => {
        setIsConfigModalOpen(!isConfigModalOpen);
    };

    const toggleMicrophone = () => {
        if (isMicrophoneEnabled) {
            setIsMicrophoneEnabled(false);
        } else {
            setIsMicrophoneEnabled(true);
        }
    };

    const toggleWebcam = () => {
        if (isWebcamEnabled) {
            setIsWebcamEnabled(false);
        } else {
            setIsWebcamEnabled(true);
        }
    };

    return (
        <ConfigContext.Provider
            value={{
                virtualBackgroundSupported,
                webcamStream,
                setWebcamBackground,
                webcamBackground,
                microphoneDeviceId,
                setMicrophoneDeviceId,
                setWebcamDeviceId,
                webcamDeviceId,
                handleConfigModal,
                isConfigModalOpen,
                environmentVariables,
                isMicrophoneEnabled,
                isWebcamEnabled,
                toggleMicrophone,
                toggleWebcam,
                isWebcamStreamAvailable,
                setIsWebcamStreamAvailable,
            }}
        >
            <ConfigModal />
            {children}
        </ConfigContext.Provider>
    );
}
