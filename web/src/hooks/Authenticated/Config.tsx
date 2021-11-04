import { createContext, useState, useEffect, useContext } from 'react';

import checkWasmSupport from '../../utils/checkWasmSupport';
import checkWebGlSupport from '../../utils/checkWebGLSupport';
import { webcamBackgrounds } from '../../utils/webcamBackgrounds';

import ConfigModal from '../../components/config';

type InterfaceConfigContext = {
    virtualBackgroundSupported: boolean;
    environmentVariables: { [key: string]: string };

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
    const [webcamStream, setWebcamStream] = useState<MediaStream>();
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

    const mute = () => {
        setIsMicrophoneEnabled(false);

        if (webcamStream) {
            const audioTracks = webcamStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = false;
            });
        }
    };

    const unmute = () => {
        setIsMicrophoneEnabled(true);

        if (webcamStream) {
            const audioTracks = webcamStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = true;
            });
        }
    };

    const toggleMicrophone = () => {
        if (isMicrophoneEnabled) {
            mute();
        } else {
            unmute();
        }
    };

    const disableVideo = () => {
        setIsWebcamEnabled(false);

        if (webcamStream) {
            const videoTracks = webcamStream.getVideoTracks();
            videoTracks.forEach(track => {
                console.log('removing', track);

                webcamStream.removeTrack(track);
            });
        }
    };

    const enableVideo = () => {
        setIsWebcamEnabled(true);

        if (webcamStream) {
            const videoTracks = webcamStream.getVideoTracks();

            videoTracks.forEach(track => {
                track.enabled = true;
            });
        }
    };

    const toggleWebcam = () => {
        if (isWebcamEnabled) {
            disableVideo();
        } else {
            enableVideo();
        }
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
                environmentVariables,
                isMicrophoneEnabled,
                isWebcamEnabled,
                toggleMicrophone,
                toggleWebcam,
            }}
        >
            <ConfigModal />
            {children}
        </ConfigContext.Provider>
    );
}
