import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Select from 'react-select';
import { FiX } from 'react-icons/fi';
import {
    BsCameraVideoFill,
    BsFillMicFill,
    BsFillGearFill,
} from 'react-icons/bs';

import { useConfig } from '../hooks/Authenticated/Config';
import { webcamBackgrounds } from '../utils/webcamBackgrounds';

import Webcam from './webcam';
import Loading from './loading';
import RadioButton from './radioButton';

const Container = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    padding: 3rem;
`;

const Content = styled.div`
    background-color: #fff;
    border-radius: 1rem;
    flex: 1;
    max-width: 900px;
    min-width: 300px;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    height: 2.5rem;

    svg {
        cursor: pointer;
        height: 2.3rem;
        width: 2.3rem;
        padding: 0.35rem;
        border-radius: 1.5rem;

        &:hover {
            background-color: #ddd;
        }
    }
`;

const MenuBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
    gap: 0.5rem;

    button {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        background-color: transparent;
        border: none;
        outline: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        cursor: pointer;

        &.active {
            background-color: #3485ff50;
            color: #0066ff;
        }

        svg {
            margin-right: 0.5rem;
        }
    }
`;

const Body = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    max-height: 500px;
    overflow-y: auto; //TODO: Style scrollbar
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;

    h2 {
        font-size: 1rem;
        margin: 0.5rem 0;
    }

    h3 {
        font-size: 0.8rem;
        margin: 0.5rem 0;
    }
`;

//TODO: i18n

type DeviceOption = {
    label: string;
    value: string;
};

type Menus = 'audioAndVideo' | 'general';

export default function Config() {
    const [activeMenu, setActiveMenu] = useState<Menus>('audioAndVideo');
    const [videoDevices, setVideoDevices] = useState<DeviceOption[]>([]);
    const [microphoneDevices, setMicrophoneDevices] = useState<DeviceOption[]>(
        [],
    );

    const {
        handleConfigModal,
        isConfigModalOpen,
        webcamBackground,
        setWebcamBackground,
        setMicrophoneDeviceId,
        setWebcamDeviceId,

        toggleMicrophone,
        toggleWebcam,
        isMicrophoneEnabled,
        isWebcamEnabled,
    } = useConfig();

    const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
        const videoInputDevices = mediaDevices
            .filter(({ kind }) => kind === 'videoinput')
            .map((device, index) => ({
                label: device.label || `Video device ${index + 1}`,
                value: device.deviceId,
            }));

        const audioInputDevices = mediaDevices
            .filter(({ kind }) => kind === 'audioinput')
            .map((device, index) => ({
                label: device.label || `Audio input device ${index + 1}`,
                value: device.deviceId,
            }));

        setVideoDevices(videoInputDevices);
        setMicrophoneDevices(audioInputDevices);

        setMicrophoneDeviceId(audioInputDevices[0].value);
        setWebcamDeviceId(videoInputDevices[0].value);
    }, []);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, []);

    return (
        <Container isOpen={isConfigModalOpen}>
            {/* TODO: Close modal when click outside content */}
            <Content>
                <Header>
                    Configurações{' '}
                    <FiX color="red" onClick={handleConfigModal} />
                </Header>
                <MenuBar>
                    <button
                        className={
                            activeMenu === 'audioAndVideo' ? 'active' : ''
                        }
                        onClick={() => setActiveMenu('audioAndVideo')}
                    >
                        <BsCameraVideoFill /> Audio e Video
                    </button>
                    <button
                        className={activeMenu === 'general' ? 'active' : ''}
                        onClick={() => setActiveMenu('general')}
                    >
                        <BsFillGearFill />
                        Geral
                    </button>
                </MenuBar>
                <Body>
                    <Menu
                        style={{
                            display:
                                activeMenu === 'audioAndVideo'
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        {!videoDevices.length || !microphoneDevices.length ? (
                            <Loading /> //TODO: Change to loading component
                        ) : (
                            <>
                                <Webcam style={{ maxWidth: '320px' }} />

                                <h2>Câmera</h2>
                                <Select
                                    options={videoDevices}
                                    defaultValue={videoDevices[0]}
                                    onChange={({ value }) =>
                                        setWebcamDeviceId(value)
                                    }
                                    maxMenuHeight={128}
                                />

                                <h2>Microfone</h2>
                                <Select
                                    options={microphoneDevices}
                                    defaultValue={microphoneDevices[0]}
                                    onChange={({ value }) =>
                                        setMicrophoneDeviceId(value)
                                    }
                                    maxMenuHeight={128}
                                />

                                <h2>Efeitos de câmera</h2>
                                <h3>Remover efeitos ou adicionar desfoque</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {webcamBackgrounds.camera.map(
                                        backgroundInfo => (
                                            <RadioButton
                                                key={backgroundInfo.label}
                                                {...backgroundInfo}
                                                onClick={setWebcamBackground}
                                                isActive={
                                                    webcamBackground?.label ===
                                                    backgroundInfo.label
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                                <h3>Planos de fundo</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {webcamBackgrounds.virtual.map(
                                        backgroundInfo => (
                                            <RadioButton
                                                key={backgroundInfo.label}
                                                {...backgroundInfo}
                                                onClick={setWebcamBackground}
                                                isActive={
                                                    webcamBackground?.label ===
                                                    backgroundInfo.label
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </>
                        )}
                    </Menu>
                    <Menu
                        style={{
                            display: activeMenu === 'general' ? 'flex' : 'none',
                        }}
                    >
                        <button onClick={toggleWebcam}>
                            toggle camera (
                            {isWebcamEnabled ? 'enabled' : 'disabled'})
                        </button>
                        <button onClick={toggleMicrophone}>
                            toggle microphone (
                            {isMicrophoneEnabled ? 'enabled' : 'disabled'})
                        </button>
                    </Menu>
                </Body>
            </Content>
        </Container>
    );
}
