import { createContext, useState, useEffect, useContext } from 'react';

import checkWasmSupport from '../utils/checkWasmSupport';
import checkWebGlSupport from '../utils/checkWebGLSupport';
import { webcamBackgrounds } from '../utils/webcamBackgrounds';

import ConfigModal from '../components/config';
import { useCallback } from 'hoist-non-react-statics/node_modules/@types/react';

type InterfaceConfigContext = {
    virtualBackgroundSupported: boolean;
    isConfigModalOpen: boolean;
    handleConfigModal: () => void;
    webcamStream: MediaStream;
    setWebcamStream: (stream: MediaStream) => void;
    webcamBackground: WebcamBackgroundTypesDisplay;
    setWebcamBackground: (background: WebcamBackgroundTypesDisplay) => void;
    webcamDeviceId: string;
    setWebcamDeviceId: (deviceId: string) => void;
    microphoneDeviceId: string;
    setMicrophoneDeviceId: (deviceId: string) => void;
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
    const [webcamStream, setWebcamStream] = useState<MediaStream>();
    const [webcamBackground, setWebcamBackground] =
        useState<WebcamBackgroundTypesDisplay>(webcamBackgrounds.camera[0]);
    const [webcamDeviceId, setWebcamDeviceId] = useState<string>();
    const [microphoneDeviceId, setMicrophoneDeviceId] = useState<string>();
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(true);

    useEffect(() => {
        setVirtualBackgroundSupported(
            checkWasmSupport() && checkWebGlSupport(),
        );
    }, []);

    const handleConfigModal = () => {
        setIsConfigModalOpen(!isConfigModalOpen);
    };

    return (
        <ConfigContext.Provider
            value={{
                virtualBackgroundSupported,
                setWebcamStream,
                webcamStream,
                setWebcamBackground,
                webcamBackground,
                microphoneDeviceId,
                setMicrophoneDeviceId,
                setWebcamDeviceId,
                webcamDeviceId,
                handleConfigModal,
                isConfigModalOpen,
            }}
        >
            <ConfigModal />
            {children}
        </ConfigContext.Provider>
    );
}
